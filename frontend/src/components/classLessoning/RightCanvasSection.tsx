import {useEffect, useState} from 'react';
import {Skia, useCanvasRef} from '@shopify/react-native-skia';
import {Socket} from 'socket.io-client';
import CanvasDrawingTool from './CanvasDrawingTool';
import pako from 'pako';

interface RightCanvasSectionProps {
  socket: Socket;
}

// Path 데이터 구조
type PathData = {
  path: any;
  color: string;
  strokeWidth: number;
  opacity: number;
  timestamp: number; // 단일 타임스탬프
};

// 스택 데이터 구조
type ActionData = {
  type: 'draw' | 'erase';
  pathData: PathData;
};

// 지우개 범위 상수
const ERASER_RADIUS = 10;

// 병합 함수 정의
const mergePaths = (pathsToMerge: PathData[]) => {
  const mergedPathString = pathsToMerge
    .map(p => p.path.toSVGString())
    .join(' ');
  const latestTimestamp = pathsToMerge[pathsToMerge.length - 1].timestamp;

  return {
    path: Skia.Path.MakeFromSVGString(mergedPathString),
    color: pathsToMerge[0].color,
    strokeWidth: pathsToMerge[0].strokeWidth,
    opacity: pathsToMerge[0].opacity,
    timestamp: latestTimestamp,
  };
};

// 오른쪽 캔버스 컴포넌트
function RightCanvasSection({
  socket,
}: RightCanvasSectionProps): React.JSX.Element {
  const canvasRef = useCanvasRef();
  const [paths, setPaths] = useState<PathData[]>([]);
  const [currentPath, setCurrentPath] = useState<any | null>(null);
  const [penColor, setPenColor] = useState('#000000');
  const [penSize, setPenSize] = useState(2);
  const [penOpacity, setPenOpacity] = useState(1);
  const [undoStack, setUndoStack] = useState<ActionData[]>([]);
  const [redoStack, setRedoStack] = useState<ActionData[]>([]);
  const [eraserPosition, setEraserPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isErasing, setIsErasing] = useState(false);

  const togglePenOpacity = () => {
    setPenOpacity(prevOpacity => (prevOpacity === 1 ? 0.4 : 1));
  };

  const toggleEraserMode = () => setIsErasing(!isErasing);

  const erasePath = (x: number, y: number) => {
    setPaths(prevPaths =>
      prevPaths.filter(pathData => {
        const bounds = pathData.path.getBounds();
        const dx = Math.max(bounds.x - x, x - (bounds.x + bounds.width), 0);
        const dy = Math.max(bounds.y - y, y - (bounds.y + bounds.height), 0);
        const isInEraseArea = dx * dx + dy * dy < ERASER_RADIUS * ERASER_RADIUS;

        if (isInEraseArea) {
          setUndoStack(prevUndoStack => [
            ...prevUndoStack,
            {type: 'erase', pathData},
          ]);
        }
        return !isInEraseArea;
      }),
    );
    setRedoStack([]);
  };

  const undo = () => {
    if (undoStack.length === 0) {
      return;
    }

    const lastAction = undoStack[undoStack.length - 1];
    setUndoStack(undoStack.slice(0, -1));

    if (lastAction.type === 'draw') {
      setPaths(paths.slice(0, -1));
      setRedoStack([...redoStack, lastAction]);
    } else if (lastAction.type === 'erase') {
      setPaths([...paths, lastAction.pathData]);
      setRedoStack([...redoStack, lastAction]);
    }
  };

  const redo = () => {
    if (redoStack.length === 0) {
      return;
    }

    const lastRedoAction = redoStack[redoStack.length - 1];
    setRedoStack(redoStack.slice(0, -1));

    if (lastRedoAction.type === 'draw') {
      setPaths([...paths, lastRedoAction.pathData]);
      setUndoStack([...undoStack, lastRedoAction]);
    } else if (lastRedoAction.type === 'erase') {
      setPaths(paths.filter(pathData => pathData !== lastRedoAction.pathData));
      setUndoStack([...undoStack, lastRedoAction]);
    }
  };

  useEffect(() => {
    socket.on('connect', () => {
      console.log('오른쪽 캔버스 서버에 연결됨:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('서버 연결이 해제되었습니다.');
    });

    socket.on('left_to_right_move', (compressedData: Uint8Array) => {
      try {
        const decompressedData = JSON.parse(
          pako.inflate(compressedData, {to: 'string'}),
        );

        const receivedPath = Skia.Path.MakeFromSVGString(decompressedData.path);
        if (receivedPath) {
          const newPathData = {
            path: receivedPath,
            color: decompressedData.color,
            strokeWidth: decompressedData.strokeWidth,
            opacity: decompressedData.opacity,
            timestamp: Date.now(),
          };

          setPaths(prevPaths => {
            const lastPath = prevPaths[prevPaths.length - 1];
            if (
              lastPath &&
              lastPath.color === newPathData.color &&
              lastPath.strokeWidth === newPathData.strokeWidth &&
              lastPath.opacity === newPathData.opacity
            ) {
              const mergedPath = mergePaths([lastPath, newPathData]);
              return [...prevPaths.slice(0, -1), mergedPath];
            } else {
              return [...prevPaths, newPathData];
            }
          });
        }
      } catch (error) {
        console.error('Failed to decompress data:', error);
      }
    });

    return () => {
      socket.off('left_to_right_move');
    };
  }, [socket]);

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
        timestamp: Date.now(),
      };

      setUndoStack(prevUndoStack => [
        ...prevUndoStack,
        {type: 'draw', pathData: newPathData},
      ]);

      socket.emit('right_to_left', {
        pathString,
        color: penColor,
        strokeWidth: penSize,
        opacity: penOpacity,
      });
      setPaths(prevPaths => [...prevPaths, newPathData]);
      setCurrentPath(null);
      setRedoStack([]);
    }
  };

  return (
    <CanvasDrawingTool
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

export default RightCanvasSection;
