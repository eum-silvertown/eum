import { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Canvas, Path, Skia, useCanvasRef } from '@shopify/react-native-skia';
import { io } from 'socket.io-client';

// Props 타입 정의
type CanvasProps = {
  canvasRef: React.RefObject<any>;
  paths: { path: Path; color: string; strokeWidth: number }[];
  currentPath: Path | null;
  penColor: string;
  penSize: number;
  handleTouchStart: (event: any) => void;
  handleTouchMove: (event: any) => void;
  handleTouchEnd: () => void;
  setPenColor: (color: string) => void;
  setPenSize: (size: number) => void;
};

const socket = io('http://192.168.128.246:8080', {
  reconnection: false,
  secure: true,
  transports: ['websocket'],
});
socket.on('connect_error', err => {
  console.log(err.message);
});

// 왼쪽 캔버스 컴포넌트
function LeftCanvasSection() {
  const canvasRef = useCanvasRef();
  const [paths, setPaths] = useState<
    { path: Path; color: string; strokeWidth: number }[]
  >([]);
  const [currentPath, setCurrentPath] = useState<Path | null>(null);
  const [penColor, setPenColor] = useState('#000000');
  const [penSize, setPenSize] = useState(2);
  const [prevPoint, setPrevPoint] = useState<{ x: number; y: number } | null>(
    null,
  );

  useEffect(() => {
    socket.on('connect', () => {
      console.log('왼쪽 캔버스 서버에 연결됨:', socket.id);
    });
    // 연결이 끊어졌을 때
    socket.on('disconnect', () => {
      console.log('서버 연결이 해제되었습니다.');
    });
    // 왼쪽 캔버스에서 전송된 그리기 데이터 수신
    console.log('Setting up right_to_left listener');
    socket.on('right_to_left', data => {
      console.log('Right to Left Path received:', data);

      const receivedPath = Skia.Path.MakeFromSVGString(data.pathString);
      if (receivedPath) {
        setPaths(prevPaths => [
          ...prevPaths,
          {
            path: receivedPath,
            color: data.color,
            strokeWidth: data.strokeWidth,
          },
        ]);
      }
    });
    return () => {
      socket.off('right_to_left');
    };
  }, []);

  const handleTouchStart = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    const newPath = Skia.Path.Make();
    newPath.moveTo(locationX, locationY);
    setCurrentPath(newPath);
    setPrevPoint({ x: locationX, y: locationY });
  };

  const handleTouchMove = (event: any) => {
    if (currentPath && prevPoint) {
      const { locationX, locationY } = event.nativeEvent;
      currentPath.lineTo(locationX, locationY);
      canvasRef.current?.redraw();
      console.log('Touch Move:', locationX, locationY);
    }
  };

  const handleTouchEnd = () => {
    if (currentPath) {
      const pathString = currentPath.toSVGString();
      const newPathData = {
        path: currentPath,
        color: penColor,
        strokeWidth: penSize,
      };
      socket.emit('left_to_right', {
        pathString,
        color: penColor,
        strokeWidth: penSize,
      }); // 오른쪽 캔버스로 데이터 전송
      setPaths(prevPaths => [...prevPaths, newPathData]);
      setCurrentPath(null);
      setPrevPoint(null);
    }
  };

  return (
    <CanvasComponent
      canvasRef={canvasRef}
      paths={paths}
      currentPath={currentPath}
      penColor={penColor}
      penSize={penSize}
      handleTouchStart={handleTouchStart}
      handleTouchMove={handleTouchMove}
      handleTouchEnd={handleTouchEnd}
      setPenColor={setPenColor}
      setPenSize={setPenSize}
    />
  );
}

// 오른쪽 캔버스 컴포넌트
function RightCanvasSection() {
  const canvasRef = useCanvasRef();
  const [paths, setPaths] = useState<
    { path: Path; color: string; strokeWidth: number }[]
  >([]);
  const [currentPath, setCurrentPath] = useState<Path | null>(null);
  const [penColor, setPenColor] = useState('#000000');
  const [penSize, setPenSize] = useState(2);
  const [prevPoint, setPrevPoint] = useState<{ x: number; y: number } | null>(
    null,
  );

  useEffect(() => {
    socket.on('connect', () => {
      console.log('오른쪽 캔버스 서버에 연결됨:', socket.id);
    });
    // 연결이 끊어졌을 때
    socket.on('disconnect', () => {
      console.log('서버 연결이 해제되었습니다.');
    });
    // 왼쪽 캔버스에서 전송된 그리기 데이터 수신
    console.log('Setting up left_to_right listener');
    socket.on('left_to_right', data => {
      console.log('Left to Right Path received:', data);

      const receivedPath = Skia.Path.MakeFromSVGString(data.pathString);
      if (receivedPath) {
        setPaths(prevPaths => [
          ...prevPaths,
          {
            path: receivedPath,
            color: data.color,
            strokeWidth: data.strokeWidth,
          },
        ]);
      }
    });
    return () => {
      socket.off('left_to_right');
    };
  }, []);

  const handleTouchStart = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    const newPath = Skia.Path.Make();
    newPath.moveTo(locationX, locationY);
    setCurrentPath(newPath);
    setPrevPoint({ x: locationX, y: locationY });
  };

  const handleTouchMove = (event: any) => {
    if (currentPath && prevPoint) {
      const { locationX, locationY } = event.nativeEvent;
      currentPath.lineTo(locationX, locationY);
      canvasRef.current?.redraw();
      console.log('Touch Move:', locationX, locationY);
    }
  };

  const handleTouchEnd = () => {
    if (currentPath) {
      const pathString = currentPath.toSVGString();
      const newPathData = {
        path: currentPath,
        color: penColor,
        strokeWidth: penSize,
      };
      socket.emit('right_to_left', {
        pathString,
        color: penColor,
        strokeWidth: penSize,
      }); // 왼쪽 캔버스로 데이터 전송
      setPaths(prevPaths => [...prevPaths, newPathData]);
      setCurrentPath(null);
      setPrevPoint(null);
    }
  };
  return (
    <CanvasComponent
      canvasRef={canvasRef}
      paths={paths}
      currentPath={currentPath}
      penColor={penColor}
      penSize={penSize}
      handleTouchStart={handleTouchStart}
      handleTouchMove={handleTouchMove}
      handleTouchEnd={handleTouchEnd}
      setPenColor={setPenColor}
      setPenSize={setPenSize}
    />
  );
}

export default function CanvasSection() {
  return (
    <View style={styles.container}>
      <LeftCanvasSection />
      <RightCanvasSection />
    </View>
  );
}

// 공통 Canvas 컴포넌트
function CanvasComponent({
  canvasRef,
  paths,
  currentPath,
  penColor,
  penSize,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  setPenColor,
  setPenSize,
}: CanvasProps) {
  const COLOR_PALETTE = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'];
  const PEN_SIZES = [2, 4, 6, 8, 10];
  return (
    <View style={styles.canvasContainer}>
      <Canvas
        ref={canvasRef}
        style={styles.canvas}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}>
        {paths.map(({ path, color, strokeWidth }, index) => (
          <Path
            key={index}
            path={path}
            color={Skia.Color(color)}
            style="stroke"
            strokeWidth={strokeWidth}
            strokeCap="round"
            strokeJoin="round"
          />
        ))}
        {currentPath && (
          <Path
            path={currentPath}
            color={Skia.Color(penColor)}
            style="stroke"
            strokeWidth={penSize}
            strokeCap="round"
            strokeJoin="round"
          />
        )}
      </Canvas>

      {/* 색상 팔레트 및 굵기 설정 */}
      <View style={styles.floatingToolbar}>
        {/* 색상 팔레트 */}
        <View style={styles.paletteContainer}>
          {COLOR_PALETTE.map(color => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorPalette,
                { backgroundColor: color },
                penColor === color && styles.selectedColor, // 선택된 색상 스타일 적용
              ]}
              onPress={() => setPenColor(color)}
            />
          ))}
        </View>

        {/* 펜 두께 설정 버튼 */}
        <View style={styles.penSizeContainer}>
          {PEN_SIZES.map(size => (
            <TouchableOpacity
              key={size}
              style={[
                styles.penSize,
                penSize === size && styles.selectedPenSize, // 선택된 두께 스타일 적용
              ]}
              onPress={() => setPenSize(size)}
            >
              <View
                style={{
                  width: size, // 펜 크기를 미리보기 위해 내부 원으로 크기 표시
                  height: size,
                  borderRadius: size / 2,
                  backgroundColor: penColor,
                }}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row' },
  canvasContainer: { flex: 1, backgroundColor: 'transparent' },
  canvas: { flex: 1 },
  floatingToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  paletteContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  colorPalette: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#000', // 선택된 색상에 테두리 표시
  },
  penSizeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  penSize: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: '#eee',
  },
  selectedPenSize: {
    borderColor: '#000', // 선택된 펜 두께에 더 두꺼운 테두리
    borderWidth: 3,
  },
});
