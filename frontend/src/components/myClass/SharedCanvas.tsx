import React, { useRef, useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, PanResponder, GestureResponderEvent } from 'react-native';
import Canvas, { CanvasRenderingContext2D } from 'react-native-canvas';
import { useCanvasSync } from '@hooks/useCanvasSync';
import ToolBar from './ToolBar';
import { DrawingEvent, DrawingTool, Point } from '~types/canvas';
import { throttle } from 'lodash';

interface SharedCanvasProps {
  roomId: string;
  userId: string;
}

const SharedCanvas: React.FC<SharedCanvasProps> = ({ roomId, userId }) => {
  const canvasRef = useRef<Canvas>(null);
  const containerRef = useRef<View>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const isDrawingRef = useRef(false);
  const activeDrawings = useRef<Map<string, DrawingEvent>>(new Map());
  const currentSessionId = useRef<string>('');

  const [currentTool, setCurrentTool] = useState<DrawingTool>({
    type: 'draw',
    color: '#FFFFFF',
    lineWidth: 2,
  });

  const drawOnCanvas = useCallback((
    ctx: CanvasRenderingContext2D,
    points: Point[],
    tool: DrawingTool
  ) => {
    console.log('drawOnCanvas', points);
    ctx.beginPath();
    ctx.strokeStyle = tool.color;
    ctx.lineWidth = tool.lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.stroke();
  }, []);

  const handleRemoteDrawing = useCallback((event: DrawingEvent) => {
    if (event.userId === userId) { return; }

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) { return; }

    const existingDrawing = activeDrawings.current.get(event.lineId);

    if (existingDrawing) {
      const points = [
        existingDrawing.points[existingDrawing.points.length - 1],
        ...event.points,
      ];

      drawOnCanvas(ctx, points, {
        type: event.type,
        color: event.color,
        lineWidth: event.lineWidth,
      });

      activeDrawings.current.set(event.lineId, {
        ...existingDrawing,
        points: [...existingDrawing.points, ...event.points],
      });
    } else {
      drawOnCanvas(ctx, event.points, {
        type: event.type,
        color: event.color,
        lineWidth: event.lineWidth,
      });
      activeDrawings.current.set(event.lineId, event);
    }
  }, [userId, drawOnCanvas]);

  const {
    sendEvent,
    currentState,
    isConnected,
  } = useCanvasSync(roomId, handleRemoteDrawing);

  const createDrawingEvent = useCallback((point: Point): DrawingEvent => ({
    type: currentTool.type,
    points: [point],
    color: currentTool.color,
    lineWidth: currentTool.lineWidth,
    userId,
    timestamp: Date.now(),
    lineId: currentSessionId.current,
  }), [currentTool, userId]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledSendEvent = useCallback(
    throttle((event: DrawingEvent) => {
      sendEvent(event);
      activeDrawings.current.delete(event.lineId);
    }, 50),
    [sendEvent]
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: (evt: GestureResponderEvent) => {
        isDrawingRef.current = true;
        currentSessionId.current = `${userId}-${Date.now()}`;

        const { locationX, locationY } = evt.nativeEvent;
        const newEvent = createDrawingEvent({ x: locationX, y: locationY });
        console.log('newEvent', newEvent);

        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          console.log('start');
          drawOnCanvas(ctx, newEvent.points, currentTool);
          console.log('start draw end');
          throttledSendEvent(newEvent);
          activeDrawings.current.set(newEvent.lineId, newEvent);
        }
      },

      onPanResponderMove: (evt: GestureResponderEvent) => {
        if (!isDrawingRef.current) { return; }

        const { locationX, locationY } = evt.nativeEvent;
        const existingDrawing = activeDrawings.current.get(currentSessionId.current);

        const newEvent: DrawingEvent = {
          ...createDrawingEvent({ x: locationX, y: locationY }),
          lineId: currentSessionId.current,
          points: existingDrawing
            ? [...existingDrawing.points, { x: locationX, y: locationY }]
            : [{ x: locationX, y: locationY }],
        };

        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          console.log('move');
          drawOnCanvas(ctx, [newEvent.points[newEvent.points.length - 2], newEvent.points[newEvent.points.length - 1]], currentTool);
          console.log('move draw end');
          throttledSendEvent(newEvent);
          activeDrawings.current.set(newEvent.lineId, newEvent);
        }
      },

      onPanResponderRelease: () => {
        isDrawingRef.current = false;
        activeDrawings.current.delete(currentSessionId.current);
      },
    })
  ).current;

  useEffect(() => {
    if (!canvasRef.current || !currentState) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    currentState.events.forEach(event => {
      drawOnCanvas(ctx, event.points, {
        type: event.type,
        color: event.color,
        lineWidth: event.lineWidth,
      });
    });
  }, [currentState, drawOnCanvas]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.measure((x, y, width, height) => {
        setCanvasSize({ width, height });

        // Canvas 크기 설정
        if (canvasRef.current) {
          canvasRef.current.width = width;
          canvasRef.current.height = height;
        }
      });
    }
  }, []);

  return (
    <View style={styles.container}>
      {/* <ToolBar
        currentTool={currentTool}
        onToolChange={setCurrentTool}
      /> */}
      <View
        ref={containerRef}
        style={styles.canvasContainer}
        {...panResponder.panHandlers}
      >
        <Canvas
          ref={canvasRef}
          style={[styles.canvas, { width: canvasSize.width, height: canvasSize.height }]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvasContainer: {
    flex: 1,
  },
  canvas: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#004414',
  },
});

export default SharedCanvas;