import {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {
  Canvas,
  Circle,
  Path,
  Skia,
  useCanvasRef,
} from '@shopify/react-native-skia';
import {io} from 'socket.io-client';

// Props 타입 정의
type CanvasProps = {
  canvasRef: React.RefObject<any>;
  paths: {path: any; color: string; strokeWidth: number; opacity: number}[];
  currentPath: any | null;
  penColor: string;
  penSize: number;
  penOpacity: number;
  handleTouchStart: (event: any) => void;
  handleTouchMove: (event: any) => void;
  handleTouchEnd: () => void;
  setPenColor: (color: string) => void;
  setPenSize: (size: number) => void;
  togglePenOpacity: () => void;
  undo: () => void;
  redo: () => void;
  toggleEraserMode: () => void;
  isErasing: boolean;
  eraserPosition: {x: number; y: number} | null;
};

// 연결할 소켓 IP
const socket = io('http://192.168.128.246:8080', {
  // TODO : 연결안될때 reconnection false 삭제
  reconnection: false,
  secure: true,
  transports: ['websocket'],
});
socket.on('connect_error', err => {
  console.log(err.message);
});

// 지우개 범위 상수
const ERASER_RADIUS = 10;

// 왼쪽 캔버스 컴포넌트
function LeftCanvasSection() {
  const canvasRef = useCanvasRef();
  const [paths, setPaths] = useState<
    {path: any; color: string; strokeWidth: number; opacity: number}[]
  >([]);
  const [currentPath, setCurrentPath] = useState<any | null>(null);
  const [penColor, setPenColor] = useState('#000000');
  const [penSize, setPenSize] = useState(2);
  const [penOpacity, setPenOpacity] = useState(1);
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [, setRedoStack] = useState<any[]>([]);
  const [eraserPosition, setEraserPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isErasing, setIsErasing] = useState(false);

  const togglePenOpacity = () => {
    setPenOpacity(prevOpacity => (prevOpacity === 1 ? 0.4 : 1)); // 형광펜 효과
    console.log('변경완료');
  };

  const toggleEraserMode = () => setIsErasing(!isErasing); // 지우개 모드 토글

  const erasePath = (x: number, y: number) => {
    setPaths(prevPaths =>
      prevPaths.filter(({path}) => {
        const bounds = path.getBounds();
        const dx = Math.max(bounds.x - x, x - (bounds.x + bounds.width), 0);
        const dy = Math.max(bounds.y - y, y - (bounds.y + bounds.height), 0);
        const isInEraseArea = dx * dx + dy * dy < ERASER_RADIUS * ERASER_RADIUS;

        if (isInEraseArea) {
          setUndoStack(prev => [...prev, path]); // 삭제된 path를 undo 스택에 추가
        }
        return !isInEraseArea;
      }),
    );
    // TODO : 예외처리 필요
    setRedoStack([]); // 지우기 작업 후 redo 스택 초기화
  };

  const undo = () => {
    if (paths.length > 0) {
      const lastPath = paths[paths.length - 1];
      setUndoStack([...undoStack, lastPath]);
      setPaths(paths.slice(0, -1));
    }
  };

  const redo = () => {
    if (undoStack.length > 0) {
      const pathToRedo = undoStack[undoStack.length - 1];
      setPaths([...paths, pathToRedo]);
      setUndoStack(undoStack.slice(0, -1));
    }
  };

  useEffect(() => {
    socket.on('connect', () => {
      console.log('왼쪽 캔버스 서버에 연결됨:', socket.id);
    });
    // 연결이 끊어졌을 때
    socket.on('disconnect', () => {
      console.log('서버 연결이 해제되었습니다.');
    });
    // 오른쪽 캔버스에서 전송된 그리기 데이터 수신
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
            opacity: data.opacity,
          },
        ]);
      }
    });
    return () => {
      socket.off('right_to_left');
    };
  }, []);

  const handleTouchStart = (event: any) => {
    const {locationX, locationY} = event.nativeEvent;
    if (isErasing) {
      setEraserPosition({x: locationX, y: locationY});
      erasePath(locationX, locationY);
    } else {
      const newPath = Skia.Path.Make();
      newPath.moveTo(locationX, locationY);
      setCurrentPath(newPath);
    }
  };

  const handleTouchMove = (event: any) => {
    const {locationX, locationY} = event.nativeEvent;
    if (isErasing) {
      setEraserPosition({x: locationX, y: locationY});
      erasePath(locationX, locationY);
    } else if (currentPath) {
      currentPath.lineTo(locationX, locationY);
      canvasRef.current?.redraw();
    }
  };

  const handleTouchEnd = () => {
    if (isErasing) {
      setEraserPosition(null);
    } else if (currentPath) {
      const pathString = currentPath.toSVGString();
      const newPathData = {
        path: currentPath,
        color: penColor,
        strokeWidth: penSize,
        opacity: penOpacity,
      };
      socket.emit('left_to_right', {
        pathString,
        color: penColor,
        strokeWidth: penSize,
        opacity: penOpacity,
      });
      setPaths(prevPaths => [...prevPaths, newPathData]);
      setCurrentPath(null);
      setRedoStack([]); // 새로운 경로가 추가되면 redo 스택 초기화
    }
  };

  return (
    <CanvasComponent
      canvasRef={canvasRef}
      paths={paths}
      currentPath={currentPath}
      penColor={penColor}
      penSize={penSize}
      penOpacity={penOpacity}
      handleTouchStart={handleTouchStart}
      handleTouchMove={handleTouchMove}
      handleTouchEnd={handleTouchEnd}
      setPenColor={setPenColor}
      setPenSize={setPenSize}
      togglePenOpacity={togglePenOpacity}
      undo={undo}
      redo={redo}
      toggleEraserMode={toggleEraserMode}
      isErasing={isErasing}
      eraserPosition={eraserPosition}
    />
  );
}

// 오른쪽 캔버스 컴포넌트
function RightCanvasSection() {
  const canvasRef = useCanvasRef();
  const [paths, setPaths] = useState<
    {path: any; color: string; strokeWidth: number; opacity: number}[]
  >([]);
  const [currentPath, setCurrentPath] = useState<any | null>(null);
  const [penColor, setPenColor] = useState('#000000');
  const [penSize, setPenSize] = useState(2);
  const [penOpacity, setPenOpacity] = useState(1);
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [, setRedoStack] = useState<any[]>([]);
  const [eraserPosition, setEraserPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isErasing, setIsErasing] = useState(false);

  const togglePenOpacity = () => {
    setPenOpacity(prevOpacity => (prevOpacity === 1 ? 0.4 : 1)); // 형광펜 효과
    console.log('변경완료');
  };

  const toggleEraserMode = () => setIsErasing(!isErasing); // 지우개 모드 토글

  const erasePath = (x: number, y: number) => {
    setPaths(prevPaths =>
      prevPaths.filter(({path}) => {
        const bounds = path.getBounds();
        const dx = Math.max(bounds.x - x, x - (bounds.x + bounds.width), 0);
        const dy = Math.max(bounds.y - y, y - (bounds.y + bounds.height), 0);
        const isInEraseArea = dx * dx + dy * dy < ERASER_RADIUS * ERASER_RADIUS;

        if (isInEraseArea) {
          setUndoStack(prev => [...prev, path]); // 삭제된 path를 undo 스택에 추가
        }
        return !isInEraseArea;
      }),
    );
    setRedoStack([]); // 지우기 작업 후 redo 스택 초기화
  };

  const undo = () => {
    if (paths.length > 0) {
      const lastPath = paths[paths.length - 1];
      setUndoStack([...undoStack, lastPath]);
      setPaths(paths.slice(0, -1));
    }
  };

  const redo = () => {
    if (undoStack.length > 0) {
      const pathToRedo = undoStack[undoStack.length - 1];
      setPaths([...paths, pathToRedo]);
      setUndoStack(undoStack.slice(0, -1));
    }
  };

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
            opacity: data.opacity,
          },
        ]);
      }
    });
    return () => {
      socket.off('left_to_right');
    };
  }, []);

  const handleTouchStart = (event: any) => {
    const {locationX, locationY} = event.nativeEvent;
    if (isErasing) {
      setEraserPosition({x: locationX, y: locationY});
      erasePath(locationX, locationY);
    } else {
      const newPath = Skia.Path.Make();
      newPath.moveTo(locationX, locationY);
      setCurrentPath(newPath);
    }
  };

  const handleTouchMove = (event: any) => {
    const {locationX, locationY} = event.nativeEvent;
    if (isErasing) {
      setEraserPosition({x: locationX, y: locationY});
      erasePath(locationX, locationY);
    } else if (currentPath) {
      currentPath.lineTo(locationX, locationY);
      canvasRef.current?.redraw();
    }
  };

  const handleTouchEnd = () => {
    if (isErasing) {
      setEraserPosition(null);
    } else if (currentPath) {
      const pathString = currentPath.toSVGString();
      const newPathData = {
        path: currentPath,
        color: penColor,
        strokeWidth: penSize,
        opacity: penOpacity,
      };
      socket.emit('right_to_left', {
        pathString,
        color: penColor,
        strokeWidth: penSize,
        opacity: penOpacity,
      });
      setPaths(prevPaths => [...prevPaths, newPathData]);
      setCurrentPath(null);
      setRedoStack([]); // 새로운 경로가 추가되면 redo 스택 초기화
    }
  };

  return (
    <CanvasComponent
      canvasRef={canvasRef}
      paths={paths}
      currentPath={currentPath}
      penColor={penColor}
      penSize={penSize}
      penOpacity={penOpacity}
      handleTouchStart={handleTouchStart}
      handleTouchMove={handleTouchMove}
      handleTouchEnd={handleTouchEnd}
      setPenColor={setPenColor}
      setPenSize={setPenSize}
      togglePenOpacity={togglePenOpacity}
      undo={undo}
      redo={redo}
      toggleEraserMode={toggleEraserMode}
      isErasing={isErasing}
      eraserPosition={eraserPosition}
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
  penOpacity,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  setPenColor,
  setPenSize,
  togglePenOpacity,
  undo,
  redo,
  toggleEraserMode,
  isErasing,
  eraserPosition,
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
        {paths.map(({path, color, strokeWidth, opacity}, index) => (
          <Path
            key={index}
            path={path}
            color={Skia.Color(color)}
            style="stroke"
            strokeWidth={strokeWidth}
            strokeCap="round"
            strokeJoin="round"
            opacity={opacity}
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
            opacity={penOpacity}
          />
        )}
        {/* 지우개 범위 시각화 */}
        {isErasing && eraserPosition && (
          <Circle
            cx={eraserPosition.x}
            cy={eraserPosition.y}
            r={10}
            color="rgba(0, 0, 0, 0.1)"
            style="stroke"
            strokeWidth={2}
          />
        )}
      </Canvas>

      {/* 툴바 */}
      <View style={styles.floatingToolbar}>
        <View style={styles.paletteContainer}>
          {COLOR_PALETTE.map(color => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorPalette,
                {backgroundColor: color},
                penColor === color && styles.selectedColor,
              ]}
              onPress={() => setPenColor(color)}
            />
          ))}
        </View>

        <View style={styles.penSizeContainer}>
          {PEN_SIZES.map(size => (
            <TouchableOpacity
              key={size}
              style={[
                styles.penSize,
                penSize === size && styles.selectedPenSize,
              ]}
              onPress={() => setPenSize(size)}>
              <View
                style={{
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  backgroundColor: penColor,
                }}
              />
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          onPress={togglePenOpacity}
          style={[
            styles.highlighterButton,
            penOpacity < 1 && styles.activeHighlighter,
          ]}>
          <Text style={styles.buttonText}>형광펜</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={undo} style={styles.toolbarButton}>
          <Text style={styles.buttonText}>Undo</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={redo} style={styles.toolbarButton}>
          <Text style={styles.buttonText}>Redo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={toggleEraserMode}
          style={isErasing ? styles.activeEraser : styles.eraserButton}>
          <Text style={styles.buttonText}>지우개</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, flexDirection: 'row'},
  canvasContainer: {flex: 1, backgroundColor: 'transparent'},
  canvas: {flex: 1},
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
    width: 25,
    height: 25,
    borderRadius: 15,
    marginHorizontal: 1.5,
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
    width: 25,
    height: 25,
    borderRadius: 15,
    marginHorizontal: 1.5,
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
  highlighterButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  activeHighlighter: {
    backgroundColor: '#FFD700',
  },
  toolbarButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  eraserButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: '#ccc',
    borderRadius: 5,
  },
  activeEraser: {
    backgroundColor: '#FFA500',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {color: '#000', fontWeight: 'bold'},
});
