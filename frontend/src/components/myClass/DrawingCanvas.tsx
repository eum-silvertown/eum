import {Text} from '@components/common/Text';
import {borderRadius} from '@theme/borderRadius';
import {borderWidth} from '@theme/borderWidth';
import {spacing} from '@theme/spacing';
import {getResponsiveSize} from '@utils/responsive';
import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  GestureResponderEvent,
  Pressable,
  findNodeHandle,
  UIManager,
} from 'react-native';
import Canvas from 'react-native-canvas';
import SockJS from 'sockjs-client';
import {Client, Message} from '@stomp/stompjs';

type Tool = 'whiteCholk' | 'redCholk' | 'blueCholk' | 'eraser';

interface DrawingPoint {
  x: number;
  y: number;
  tool: Tool;
  color: string;
  type: 'start' | 'move' | 'end';
}

interface DrawingCanvasProps {
  roomId: string; // 드로잉 룸 식별자
  userId: string; // 사용자 식별자
}

const SOCKET_URL = 'http://k11d101.p.ssafy.io/ws-gateway/drawing'; // WebSocket 서버 URL을 설정하세요

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({roomId, userId}) => {
  const currentTool = useRef<Tool>('whiteCholk');
  const currentColor = useRef('#ffffff');
  const [selectedTool, setSelectedTool] = useState<Tool>('whiteCholk');
  const canvasRef = useRef<Canvas | null>(null);
  const stompClient = useRef<Client | null>(null);
  const [canvasSize, setCanvasSize] = useState<{width: number; height: number}>(
    {
      width: 0,
      height: 0,
    },
  );

  const canvasBounds = useRef<{
    left: number;
    right: number;
    top: number;
    bottom: number;
  } | null>(null);

  // WebSocket 연결 설정
  useEffect(() => {
    const socket = new SockJS(SOCKET_URL);
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      debug: str => {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.current.onConnect = () => {
      console.log('Connected to WebSocket');

      // 룸 구독
      stompClient.current?.subscribe(
        `/topic/drawing/${roomId}`,
        (message: Message) => {
          handleReceivedDrawing(JSON.parse(message.body));
        },
      );
    };

    stompClient.current.onStompError = frame => {
      console.error('STOMP error', frame);
    };

    stompClient.current.activate();

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [roomId]);

  // 다른 사용자의 드로잉 데이터 처리
  const handleReceivedDrawing = (drawingPoint: DrawingPoint) => {
    if (!canvasRef.current) {
      return;
    }

    const ctx = canvasRef.current.getContext('2d');

    if (drawingPoint.type === 'start') {
      ctx.beginPath();
      ctx.moveTo(drawingPoint.x, drawingPoint.y);
    } else if (drawingPoint.type === 'move') {
      if (drawingPoint.tool === 'eraser') {
        ctx.strokeStyle = '#004414';
        ctx.lineWidth = 50;
      } else {
        ctx.strokeStyle = drawingPoint.color;
        ctx.lineWidth = 2;
      }
      ctx.lineTo(drawingPoint.x, drawingPoint.y);
      ctx.stroke();
    } else if (drawingPoint.type === 'end') {
      ctx.closePath();
    }
  };

  const handleLayout = () => {
    if (canvasRef.current) {
      const handle = findNodeHandle(canvasRef.current);
      if (handle) {
        UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
          canvasBounds.current = {
            left: pageX,
            right: pageX + width,
            top: pageY,
            bottom: pageY + height - getResponsiveSize(30),
          };
          setCanvasSize({width, height});
        });
      }
    }
  };

  useEffect(() => {
    if (canvasRef.current && canvasSize.width && canvasSize.height) {
      const canvas = canvasRef.current;
      canvas.width = canvasSize.width;
      canvas.height = canvasSize.height;

      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.fillStyle = '#004414';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [canvasSize]);

  const handleDrawing = (
    evt: GestureResponderEvent,
    type: 'start' | 'move' | 'end',
  ) => {
    const {locationX, locationY, pageX, pageY} = evt.nativeEvent;
    const canvas = canvasRef.current;

    if (!canvas || !canvasBounds.current) {
      return;
    }

    const {left, right, top, bottom} = canvasBounds.current;
    const ctx = canvas.getContext('2d');

    const isInsideCanvas =
      pageX >= left && pageX <= right && pageY >= top && pageY <= bottom;

    if (!isInsideCanvas) {
      return;
    }

    // WebSocket을 통해 드로잉 데이터 전송
    const drawingPoint: DrawingPoint = {
      x: locationX,
      y: locationY,
      tool: currentTool.current,
      color: currentColor.current,
      type: type,
    };

    if (stompClient.current?.connected) {
      stompClient.current.publish({
        destination: `/app/drawing/${roomId}`,
        body: JSON.stringify({
          userId,
          drawingPoint,
        }),
      });
    }

    // 로컬 캔버스에 그리기
    if (type === 'start') {
      ctx.beginPath();
      ctx.moveTo(locationX, locationY);
    } else if (type === 'move') {
      if (currentTool.current === 'eraser') {
        ctx.strokeStyle = '#004414';
        ctx.lineWidth = 50;
      } else {
        ctx.strokeStyle = currentColor.current;
        ctx.lineWidth = 2;
      }
      ctx.lineTo(locationX, locationY);
      ctx.stroke();
    } else if (type === 'end') {
      ctx.closePath();
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: evt => handleDrawing(evt, 'start'),
      onPanResponderMove: evt => handleDrawing(evt, 'move'),
      onPanResponderRelease: evt => handleDrawing(evt, 'end'),
    }),
  ).current;

  const handleToolChange = (tool: Tool) => {
    currentTool.current = tool;
    setSelectedTool(tool);
  };

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <View style={styles.toolbar}>
        <View style={styles.cholks}>
          <Pressable
            style={[
              styles.whiteCholk,
              selectedTool === 'whiteCholk' && styles.selectedTool,
            ]}
            onPress={() => {
              handleToolChange('whiteCholk');
              currentColor.current = '#ffffff';
            }}
          />
          <Pressable
            style={[
              styles.redCholk,
              selectedTool === 'redCholk' && styles.selectedTool,
            ]}
            onPress={() => {
              handleToolChange('redCholk');
              currentColor.current = '#ff4f4f';
            }}
          />
          <Pressable
            style={[
              styles.blueCholk,
              selectedTool === 'blueCholk' && styles.selectedTool,
            ]}
            onPress={() => {
              handleToolChange('blueCholk');
              currentColor.current = '#5c8fff';
            }}
          />
        </View>
        <Pressable
          style={[
            styles.eraser,
            selectedTool === 'eraser' && styles.selectedTool,
          ]}
          onPress={() => handleToolChange('eraser')}>
          <Text color="white">지우개</Text>
        </Pressable>
      </View>

      <View style={styles.drawingArea} {...panResponder.panHandlers}>
        <Canvas ref={canvasRef} style={styles.canvas} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawingArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    position: 'absolute',
    zIndex: 1,
    bottom: 0,
    width: '100%',
  },
  cholks: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  whiteCholk: {
    width: getResponsiveSize(30),
    height: getResponsiveSize(10),
    backgroundColor: '#fff',
    borderRadius: borderRadius.sm,
  },
  redCholk: {
    width: getResponsiveSize(30),
    height: getResponsiveSize(10),
    backgroundColor: '#ff4f4f',
    borderRadius: borderRadius.sm,
  },
  blueCholk: {
    width: getResponsiveSize(30),
    height: getResponsiveSize(10),
    backgroundColor: '#5c8fff',
    borderRadius: borderRadius.sm,
  },
  eraser: {
    justifyContent: 'center',
    alignItems: 'center',
    width: getResponsiveSize(60),
    height: getResponsiveSize(30),
    backgroundColor: '#550055',
    borderRadius: borderRadius.md,
  },
  selectedTool: {
    borderWidth: borderWidth.md,
    borderColor: '#ffff00',
  },
});

export default DrawingCanvas;
