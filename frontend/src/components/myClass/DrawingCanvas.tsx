import {Text} from '@components/common/Text';
import {getResponsiveSize} from '@utils/responsive';
import React, {useRef, useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  GestureResponderEvent,
  findNodeHandle,
  UIManager,
} from 'react-native';
import Canvas, {CanvasRenderingContext2D} from 'react-native-canvas';
import SockJS from 'sockjs-client';
import {Client, Message} from '@stomp/stompjs';
import {useAuthStore} from '@store/useAuthStore';
import Toolbar from './Toolbar';

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

// const SOCKET_URL = 'http://192.168.100.187:8080/ws-gateway/drawing';
const SOCKET_URL = 'http://k11d101.p.ssafy.io/ws-gateway/drawing';
const BUFFER_INTERVAL = 1000; // 1초마다 데이터 전송

export default function DrawingCanvas() {
  const classId = useAuthStore(state => state.userInfo.classInfo.classId);
  const userId = useAuthStore(state => state.userInfo.id).toString();
  const currentTool = useRef<Tool>('whiteCholk');
  const currentColor = useRef('#ffffff');
  const canvasRef = useRef<Canvas | null>(null);
  const stompClient = useRef<Client | null>(null);
  const activeDrawings = useRef<Map<string, DrawingState>>(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const isConnectedRef = useRef<boolean>(false);
  const drawingBuffer = useRef<DrawingPoint[]>([]);
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
  const initializeCanvas = useCallback((canvas: Canvas) => {
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fillStyle = '#004414';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  // 드로잉 함수
  const drawLine = useCallback(
    (ctx: CanvasRenderingContext2D, point: DrawingPoint) => {
      if (point.tool === 'eraser') {
        ctx.strokeStyle = '#004414';
        ctx.lineWidth = 50;
      } else {
        ctx.strokeStyle = point.color;
        ctx.lineWidth = 2;
      }
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    },
    [],
  );

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

      // 드로잉 이벤트 구독
      stompClient.current?.subscribe(
        `/topic/classroom/1234`,
        (message: Message) => {
          const data = JSON.parse(message.body);
          if (data.userId !== userId.toString()) {
            // 자신의 드로잉이 아닐 때만 처리
            handleReceivedDrawing(data);
          }
        },
      );

      // 캔버스 상태 구독
      stompClient.current?.subscribe(
        `/topic/queue/snapshot/1234`,
        (message: Message) => {
          handleCanvasState(JSON.parse(message.body));
        },
      );

      // 초기 캔버스 상태 요청
      stompClient.current?.publish({
        destination: `/app/canvas/${classId}/state-request`,
        body: JSON.stringify({userId}),
      });
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
  }, [classId, userId]);

  // 캔버스 상태 처리
  const handleCanvasState = useCallback(
    (state: {lines: DrawingPoint[][]}) => {
      if (!canvasRef.current) return;

      const ctx = canvasRef.current.getContext('2d');
      initializeCanvas(canvasRef.current);

      state.lines.forEach(line => {
        if (line.length > 0) {
          ctx.beginPath();
          ctx.moveTo(line[0].x, line[0].y);
          line.slice(1).forEach(point => {
            drawLine(ctx, point);
          });
          ctx.closePath();
        }
      });
    },
    [initializeCanvas, drawLine],
  );

  // 원격 드로잉 처리
  const handleReceivedDrawing = useCallback(
    (data: DrawingPoint[]) => {
      if (!canvasRef.current) return;

      const ctx = canvasRef.current.getContext('2d');
      const points = data;

      points.forEach(point => {
        const drawingState = activeDrawings.current.get(point.userId);

        if (point.type === 'start') {
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          activeDrawings.current.set(point.userId, {
            userId: point.userId,
            isDrawing: true,
            currentLineId: point.lineId,
          });
        } else if (
          point.type === 'move' &&
          drawingState?.isDrawing &&
          drawingState.currentLineId === point.lineId
        ) {
          drawLine(ctx, point);
        } else if (point.type === 'end') {
          ctx.closePath();
          if (drawingState) {
            drawingState.isDrawing = false;
            drawingState.currentLineId = null;
          }
        }
      });
    },
    [drawLine],
  );

  // 버퍼 플러시
  const flushBuffer = useCallback(() => {
    if (drawingBuffer.current.length > 0 && stompClient.current?.connected) {
      stompClient.current.publish({
        destination: `/app/drawing/classroom/${userId}`,
        body: JSON.stringify(drawingBuffer.current),
      });
      drawingBuffer.current = [];
    }
  }, [classId, userId]);

  // 주기적 버퍼 플러시
  useEffect(() => {
    const intervalId = setInterval(flushBuffer, BUFFER_INTERVAL);
    return () => clearInterval(intervalId);
  }, [flushBuffer]);

  // 로컬 드로잉 처리
  const handleDrawing = useCallback(
    (evt: GestureResponderEvent, type: 'start' | 'move' | 'end') => {
      const {locationX, locationY, pageX, pageY} = evt.nativeEvent;
      if (
        !canvasRef.current ||
        !canvasBounds.current ||
        !isConnectedRef.current
      )
        return;

      const {left, right, top, bottom} = canvasBounds.current;
      const ctx = canvasRef.current.getContext('2d');

      const isInsideCanvas =
        pageX >= left && pageX <= right && pageY >= top && pageY <= bottom;

      if (!isInsideCanvas) return;

      const lineId =
        type === 'start'
          ? `${userId}-${Date.now()}`
          : activeDrawings.current.get(userId)?.currentLineId || '';

      // 로컬 드로잉 처리
      if (type === 'start') {
        ctx.beginPath();
        ctx.moveTo(locationX, locationY);
        activeDrawings.current.set(userId, {
          userId,
          isDrawing: true,
          currentLineId: lineId,
        });
      } else if (
        type === 'move' &&
        activeDrawings.current.get(userId)?.isDrawing &&
        activeDrawings.current.get(userId)?.currentLineId === lineId
      ) {
        const point: DrawingPoint = {
          x: locationX,
          y: locationY,
          tool: currentTool.current,
          color: currentColor.current,
          type,
          timestamp: Date.now(),
          userId,
          lineId,
        };
        drawLine(ctx, point);
      } else if (type === 'end') {
        ctx.closePath();
        const state = activeDrawings.current.get(userId);
        if (state) {
          state.isDrawing = false;
          state.currentLineId = null;
        }
      }

      // 드로잉 포인트를 버퍼에 추가
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

      drawingBuffer.current.push(drawingPoint);
    },
    [userId, drawLine],
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: evt => handleDrawing(evt, 'start'),
      onPanResponderMove: evt => handleDrawing(evt, 'move'),
      onPanResponderRelease: evt => handleDrawing(evt, 'end'),
    }),
  ).current;

  const handleLayout = useCallback(() => {
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
  }, []);

  useEffect(() => {
    if (canvasSize.width && canvasSize.height && canvasRef.current) {
      canvasRef.current.width = canvasSize.width;
      canvasRef.current.height = canvasSize.height;
      initializeCanvas(canvasRef.current);
    }
  }, [canvasSize, initializeCanvas]);

  useEffect(() => {
    isConnectedRef.current = isConnected;
  }, [isConnected]);

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <Toolbar currentColor={currentColor} currentTool={currentTool} />
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
});