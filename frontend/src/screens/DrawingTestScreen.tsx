import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  TouchableOpacity,
  Text,
  GestureResponderEvent,
  LayoutChangeEvent,
} from 'react-native';
import Canvas from 'react-native-canvas';

type Tool = 'pen' | 'rect' | 'circle' | 'eraser';

const DrawingTestScreen: React.FC = () => {
  // 실제 그리기 도구는 useRef로 관리
  const currentTool = useRef<Tool>('pen');
  // UI 상태용 선택된 도구는 useState로 관리
  const [selectedTool, setSelectedTool] = useState<Tool>('pen');
  const canvasRef = useRef<Canvas | null>(null);
  const [canvasSize, setCanvasSize] = useState<{width: number; height: number}>(
    {
      width: 0,
      height: 0,
    },
  );

  const handleLayout = (event: LayoutChangeEvent) => {
    const {width, height} = event.nativeEvent.layout;
    setCanvasSize({width, height});
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

      // 초기 캔버스 배경색 설정
      ctx.fillStyle = '#004414';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [canvasSize]);

  const handleDrawing = (
    evt: GestureResponderEvent,
    type: 'start' | 'move' | 'end',
  ) => {
    const {locationX, locationY} = evt.nativeEvent;
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    switch (type) {
      case 'start':
        ctx.beginPath();
        ctx.moveTo(locationX, locationY);
        break;

      case 'move':
        if (currentTool.current === 'eraser') {
          // 지우개는 흰색으로 그리기
          ctx.strokeStyle = '#004414';
          ctx.lineWidth = 20; // 지우개 크기
        } else {
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 2;
        }
        ctx.lineTo(locationX, locationY);
        ctx.stroke();
        break;

      case 'end':
        // 그리기 설정 초기화
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        break;
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
    currentTool.current = tool; // 실제 그리기 도구 변경
    setSelectedTool(tool); // UI 상태 변경
  };

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <View style={styles.toolbar}>
        <TouchableOpacity
          style={[styles.tool, selectedTool === 'pen' && styles.selectedTool]}
          onPress={() => handleToolChange('pen')}>
          <Text>펜</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tool,
            selectedTool === 'eraser' && styles.selectedTool,
          ]}
          onPress={() => handleToolChange('eraser')}>
          <Text>지우개</Text>
        </TouchableOpacity>
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
    backgroundColor: '#ffffff', // 배경색 추가
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
    padding: 10,
    backgroundColor: '#f0f0f0',
    zIndex: 1,
  },
  tool: {
    padding: 10,
    marginRight: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  selectedTool: {
    backgroundColor: '#e0e0e0',
  },
});

export default DrawingTestScreen;
