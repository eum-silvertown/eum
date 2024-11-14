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
  timestamp: number;
  userId: string;
  lineId: string;
}
interface DrawingState {
  userId: string;
  isDrawing: boolean;
  currentLineId: string | null;
}
interface DrawingCanvasProps {
  roomId: string;
  userId: string;
}

const SOCKET_URL = 'http://k11d101.p.ssafy.io/ws-gateway/drawing';

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({roomId, userId}) => {
  const currentTool = useRef<Tool>('whiteCholk');
  const currentColor = useRef('#ffffff');
  const [selectedTool, setSelectedTool] = useState<Tool>('whiteCholk');
  const canvasRef = useRef<Canvas | null>(null);
  const stompClient = useRef<Client | null>(null);
  const activeDrawings = useRef<Map<string, DrawingState>>(new Map());
  const [isConnected, setIsConnected] = useState(false);
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

  // 캔버스 초기화 함수
  const initializeCanvas = (canvas: Canvas) => {
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fillStyle = '#004414';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  // 캔버스 상태 요청
  const requestCanvasState = () => {
    if (stompClient.current?.connected) {
      stompClient.current.publish({
        destination: `/app/canvas/${roomId}/state-request`,
        body: JSON.stringify({userId}),
      });
    }
  };

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
      setIsConnected(true);

      // 룸의 드로잉 이벤트 구독
      stompClient.current?.subscribe(
        `/topic/drawing/${roomId}`,
        (message: Message) => {
          handleReceivedDrawing(JSON.parse(message.body));
        },
      );

      // 캔버스 상태 구독
      stompClient.current?.subscribe(
        `/topic/canvas/${roomId}/state`,
        (message: Message) => {
          handleCanvasState(JSON.parse(message.body));
        },
      );

      // 현재 캔버스 상태 요청
      requestCanvasState();
    };

    stompClient.current.onDisconnect = () => {
      setIsConnected(false);
    };

    stompClient.current.activate();

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  // 캔버스 상태 수신 처리
  const handleCanvasState = (state: {
    lines: DrawingPoint[][];
    timestamp: number;
  }) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    initializeCanvas(canvas);

    // 저장된 모든 선 다시 그리기
    state.lines.forEach(line => {
      if (line.length > 0) {
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        line.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            if (point.tool === 'eraser') {
              ctx.strokeStyle = '#004414';
              ctx.lineWidth = 50;
            } else {
              ctx.strokeStyle = point.color;
              ctx.lineWidth = 2;
            }
            ctx.lineTo(point.x, point.y);
            ctx.stroke();
          }
        });
        ctx.closePath();
      }
    });
  };

  // 다른 사용자의 드로잉 데이터 처리
  const handleReceivedDrawing = (data: {
    userId: string;
    drawingPoint: DrawingPoint;
  }) => {
    if (!canvasRef.current || data.userId === userId) return;

    const {userId: drawerId, drawingPoint} = data;
    const ctx = canvasRef.current.getContext('2d');

    // 현재 그리기 상태 관리
    let drawingState = activeDrawings.current.get(drawerId);
    if (!drawingState) {
      drawingState = {
        userId: drawerId,
        isDrawing: false,
        currentLineId: null,
      };
      activeDrawings.current.set(drawerId, drawingState);
    }

    if (drawingPoint.type === 'start') {
      drawingState.isDrawing = true;
      drawingState.currentLineId = drawingPoint.lineId;
      ctx.beginPath();
      ctx.moveTo(drawingPoint.x, drawingPoint.y);
    } else if (
      drawingPoint.type === 'move' &&
      drawingState.isDrawing &&
      drawingState.currentLineId === drawingPoint.lineId
    ) {
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
      drawingState.isDrawing = false;
      drawingState.currentLineId = null;
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
            bottom: pageY + height - getResponsiveSize(48),
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
      initializeCanvas(canvas);
    }
  }, [canvasSize]);

  const handleDrawing = (
    evt: GestureResponderEvent,
    type: 'start' | 'move' | 'end',
  ) => {
    const {locationX, locationY, pageX, pageY} = evt.nativeEvent;
    const canvas = canvasRef.current;

    if (!canvas || !canvasBounds.current || !isConnected) return;

    const {left, right, top, bottom} = canvasBounds.current;
    const ctx = canvas.getContext('2d');

    const isInsideCanvas =
      pageX >= left && pageX <= right && pageY >= top && pageY <= bottom;

    if (!isInsideCanvas) return;

    // 현재 그리기 작업의 고유 ID 생성 (시작할 때만)
    const lineId =
      type === 'start'
        ? `${userId}-${Date.now()}`
        : activeDrawings.current.get(userId)?.currentLineId || '';

    // WebSocket을 통해 드로잉 데이터 전송
    const drawingPoint: DrawingPoint = {
      x: locationX,
      y: locationY,
      tool: currentTool.current,
      color: currentColor.current,
      type,
      timestamp: Date.now(),
      userId,
      lineId,
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
      activeDrawings.current.set(userId, {
        userId,
        isDrawing: true,
        currentLineId: lineId,
      });
      ctx.beginPath();
      ctx.moveTo(locationX, locationY);
    } else if (
      type === 'move' &&
      activeDrawings.current.get(userId)?.isDrawing &&
      activeDrawings.current.get(userId)?.currentLineId === lineId
    ) {
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
      const state = activeDrawings.current.get(userId);
      if (state) {
        state.isDrawing = false;
        state.currentLineId = null;
      }
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

      <View style={styles.drawingArea}>
        <View style={StyleSheet.absoluteFill} {...panResponder.panHandlers}>
          <Canvas ref={canvasRef} style={styles.canvas} />
        </View>
        {!isConnected && (
          <View style={styles.disconnectedOverlay}>
            <Text color="white">연결 중...</Text>
          </View>
        )}
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
    flex: 1,
    width: '100%',
    height: '100%',
  },
  disconnectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
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
    width: getResponsiveSize(48),
    height: getResponsiveSize(16),
    backgroundColor: '#fff',
    borderRadius: borderRadius.sm,
  },
  redCholk: {
    width: getResponsiveSize(48),
    height: getResponsiveSize(16),
    backgroundColor: '#ff4f4f',
    borderRadius: borderRadius.sm,
  },
  blueCholk: {
    width: getResponsiveSize(48),
    height: getResponsiveSize(16),
    backgroundColor: '#5c8fff',
    borderRadius: borderRadius.sm,
  },
  eraser: {
    justifyContent: 'center',
    alignItems: 'center',
    width: getResponsiveSize(96),
    height: getResponsiveSize(48),
    backgroundColor: '#550055',
    borderRadius: borderRadius.md,
  },
  selectedTool: {
    borderWidth: borderWidth.md,
    borderColor: '#ffff00',
  },
});

export default DrawingCanvas;
