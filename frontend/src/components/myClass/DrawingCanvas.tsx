// import {Text} from '@components/common/Text';
// import {borderRadius} from '@theme/borderRadius';
// import {borderWidth} from '@theme/borderWidth';
// import {spacing} from '@theme/spacing';
// import {getResponsiveSize} from '@utils/responsive';
// import React, {useRef, useState, useEffect} from 'react';
// import {
//   View,
//   StyleSheet,
//   PanResponder,
//   GestureResponderEvent,
//   Pressable,
//   findNodeHandle,
//   UIManager,
// } from 'react-native';
// import Canvas from 'react-native-canvas';

// type Tool = 'whiteCholk' | 'redCholk' | 'blueCholk' | 'eraser';

// const DrawingCanvas: React.FC = () => {
//   // 실제 그리기 도구는 useRef로 관리
//   const currentTool = useRef<Tool>('whiteCholk');
//   const currentColor = useRef('#ffffff');
//   // UI 상태용 선택된 도구는 useState로 관리
//   const [selectedTool, setSelectedTool] = useState<Tool>('whiteCholk');
//   const canvasRef = useRef<Canvas | null>(null);
//   const [canvasSize, setCanvasSize] = useState<{width: number; height: number}>(
//     {
//       width: 0,
//       height: 0,
//     },
//   );

//   const canvasBounds = useRef<{
//     left: number;
//     right: number;
//     top: number;
//     bottom: number;
//   } | null>(null);

//   const handleLayout = () => {
//     if (canvasRef.current) {
//       const handle = findNodeHandle(canvasRef.current);
//       if (handle) {
//         UIManager.measure(handle, (x, y, width, height, pageX, pageY) => {
//           // 캔버스의 절대 위치 저장
//           canvasBounds.current = {
//             left: pageX,
//             right: pageX + width,
//             top: pageY,
//             bottom: pageY + height - getResponsiveSize(30),
//           };
//           setCanvasSize({width, height});
//         });
//       }
//     }
//   };

//   useEffect(() => {
//     if (canvasRef.current && canvasSize.width && canvasSize.height) {
//       const canvas = canvasRef.current;
//       canvas.width = canvasSize.width;
//       canvas.height = canvasSize.height;

//       const ctx = canvas.getContext('2d');
//       ctx.strokeStyle = '#000000';
//       ctx.lineWidth = 2;
//       ctx.lineCap = 'round';
//       ctx.lineJoin = 'round';

//       // 초기 캔버스 배경색 설정
//       ctx.fillStyle = '#004414';
//       ctx.fillRect(0, 0, canvas.width, canvas.height);
//     }
//   }, [canvasSize]);

//   const handleDrawing = (
//     evt: GestureResponderEvent,
//     type: 'start' | 'move' | 'end',
//   ) => {
//     const {locationX, locationY, pageX, pageY} = evt.nativeEvent;
//     const canvas = canvasRef.current;

//     if (!canvas || !canvasBounds.current) return;

//     const {left, right, top, bottom} = canvasBounds.current;
//     const ctx = canvas.getContext('2d');

//     // 현재 터치 위치가 캔버스 범위 내에 있는지 확인
//     const isInsideCanvas =
//       pageX >= left && pageX <= right && pageY >= top && pageY <= bottom;

//     if (type === 'start' && isInsideCanvas) {
//       ctx.beginPath();
//       ctx.moveTo(locationX, locationY);
//     } else if (type === 'move' && isInsideCanvas) {
//       if (currentTool.current === 'eraser') {
//         ctx.strokeStyle = '#004414';
//         ctx.lineWidth = 50;
//       } else {
//         ctx.strokeStyle = currentColor.current;
//         ctx.lineWidth = 2;
//       }
//       ctx.lineTo(locationX, locationY);
//       ctx.stroke();
//     } else if (type === 'end') {
//       // 터치가 끝나면 그리기 종료
//       ctx.closePath();
//     }
//   };

//   const panResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onMoveShouldSetPanResponder: () => true,
//       onPanResponderGrant: evt => handleDrawing(evt, 'start'),
//       onPanResponderMove: evt => handleDrawing(evt, 'move'),
//       onPanResponderRelease: evt => handleDrawing(evt, 'end'),
//     }),
//   ).current;

//   const handleToolChange = (tool: Tool) => {
//     currentTool.current = tool; // 실제 그리기 도구 변경
//     setSelectedTool(tool); // UI 상태 변경
//   };

//   return (
//     <View style={styles.container} onLayout={handleLayout}>
//       <View style={styles.toolbar}>
//         <View style={styles.cholks}>
//           <Pressable
//             style={[
//               styles.whiteCholk,
//               selectedTool === 'whiteCholk' && styles.selectedTool,
//             ]}
//             onPress={() => {
//               handleToolChange('whiteCholk');
//               currentColor.current = '#ffffff';
//             }}
//           />
//           <Pressable
//             style={[
//               styles.redCholk,
//               selectedTool === 'redCholk' && styles.selectedTool,
//             ]}
//             onPress={() => {
//               handleToolChange('redCholk');
//               currentColor.current = '#ff4f4f';
//             }}
//           />
//           <Pressable
//             style={[
//               styles.blueCholk,
//               selectedTool === 'blueCholk' && styles.selectedTool,
//             ]}
//             onPress={() => {
//               handleToolChange('blueCholk');
//               currentColor.current = '#5c8fff';
//             }}
//           />
//         </View>
//         <Pressable
//           style={[
//             styles.eraser,
//             selectedTool === 'eraser' && styles.selectedTool,
//           ]}
//           onPress={() => handleToolChange('eraser')}>
//           <Text color="white">지우개</Text>
//         </Pressable>
//       </View>

//       <View style={styles.drawingArea} {...panResponder.panHandlers}>
//         <Canvas ref={canvasRef} style={styles.canvas} />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   drawingArea: {
//     flex: 1,
//     backgroundColor: '#ffffff', // 배경색 추가
//   },
//   canvas: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     width: '100%',
//     height: '100%',
//   },
//   toolbar: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'flex-end',
//     position: 'absolute',
//     zIndex: 1,
//     bottom: 0,
//     width: '100%',
//   },
//   cholks: {
//     flexDirection: 'row',
//     gap: spacing.lg,
//   },
//   whiteCholk: {
//     width: getResponsiveSize(30),
//     height: getResponsiveSize(10),
//     backgroundColor: '#fff',
//     borderRadius: borderRadius.sm,
//   },
//   redCholk: {
//     width: getResponsiveSize(30),
//     height: getResponsiveSize(10),
//     backgroundColor: '#ff4f4f',
//     borderRadius: borderRadius.sm,
//   },
//   blueCholk: {
//     width: getResponsiveSize(30),
//     height: getResponsiveSize(10),
//     backgroundColor: '#5c8fff',
//     borderRadius: borderRadius.sm,
//   },
//   eraser: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: getResponsiveSize(60),
//     height: getResponsiveSize(30),
//     backgroundColor: '#550055',
//     borderRadius: borderRadius.md,
//   },
//   selectedTool: {
//     borderWidth: borderWidth.md,
//     borderColor: '#ffff00',
//   },
// });

// export default DrawingCanvas;

import React, {useRef, useState} from 'react';
import {View, PanResponder, StyleSheet} from 'react-native';
import Canvas, {Image, ImageData} from 'react-native-canvas';

const DrawingBoard = () => {
  const canvasRef = useRef(null);
  const [mode, setMode] = useState('draw'); // 'draw' or 'erase'

  // 캔버스 컨텍스트 상태 저장
  const [context, setContext] = useState(null);
  const [imageData, setImageData] = useState(null);

  // 이전 터치 포인트 저장
  const prevPoint = useRef(null);

  // 지우개 설정
  const ERASER_SIZE = 20;

  const initCanvas = async canvas => {
    if (canvas) {
      canvas.width = 300;
      canvas.height = 400;

      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setContext(ctx);
    }
  };

  // 픽셀 단위로 지우개와 그려진 선의 충돌 감지
  const eraseAtPoint = (x, y) => {
    if (!context) return;

    // 현재 캔버스의 이미지 데이터 가져오기
    const currentImageData = context.getImageData(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height,
    );
    const pixels = currentImageData.data;

    // 지우개 영역 내의 모든 픽셀 검사
    for (let i = -ERASER_SIZE; i < ERASER_SIZE; i++) {
      for (let j = -ERASER_SIZE; j < ERASER_SIZE; j++) {
        // 원형 지우개 영역 계산
        if (i * i + j * j <= ERASER_SIZE * ERASER_SIZE) {
          const pixelX = Math.round(x + i);
          const pixelY = Math.round(y + j);

          // 캔버스 범위 체크
          if (
            pixelX >= 0 &&
            pixelX < canvasRef.current.width &&
            pixelY >= 0 &&
            pixelY < canvasRef.current.height
          ) {
            // 픽셀 인덱스 계산 (RGBA 각각 4바이트)
            const index = (pixelY * canvasRef.current.width + pixelX) * 4;

            // 해당 픽셀을 흰색으로 설정
            pixels[index] = 255; // R
            pixels[index + 1] = 255; // G
            pixels[index + 2] = 255; // B
            pixels[index + 3] = 255; // A
          }
        }
      }
    }

    // 수정된 이미지 데이터를 캔버스에 다시 그리기
    context.putImageData(currentImageData, 0, 0);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,

    onPanResponderGrant: (evt, gestureState) => {
      const {locationX, locationY} = evt.nativeEvent;
      prevPoint.current = {x: locationX, y: locationY};

      if (mode === 'erase') {
        eraseAtPoint(locationX, locationY);
      }
    },

    onPanResponderMove: (evt, gestureState) => {
      const {locationX, locationY} = evt.nativeEvent;

      if (mode === 'draw') {
        // 그리기 모드
        if (prevPoint.current) {
          context.beginPath();
          context.moveTo(prevPoint.current.x, prevPoint.current.y);
          context.lineTo(locationX, locationY);
          context.strokeStyle = 'black';
          context.lineWidth = 2;
          context.stroke();
        }
      } else {
        // 지우개 모드
        eraseAtPoint(locationX, locationY);
      }

      prevPoint.current = {x: locationX, y: locationY};
    },

    onPanResponderRelease: () => {
      prevPoint.current = null;
    },
  });

  return (
    <View style={styles.container}>
      <Canvas
        ref={canvasRef}
        onLayout={() => initCanvas(canvasRef.current)}
        {...panResponder.panHandlers}
        style={styles.canvas}
      />
      {/* 모드 전환 버튼 등의 UI 요소 추가 가능 */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvas: {
    width: 300,
    height: 400,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default DrawingBoard;
