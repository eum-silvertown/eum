import {useEffect, useRef, useState} from 'react';
import {Skia, useCanvasRef} from '@shopify/react-native-skia';
import CanvasDrawingTool from './CanvasDrawingTool';
import {Socket} from 'socket.io-client';

import pako from 'pako';
import {throttle} from 'lodash';

interface LeftCanvasSectionProps {
  socket: Socket;
  onRecordingEnd: (recordedPaths: PathData[]) => void;
}

// Path 데이터 구조
type PathData = {
  path: any;
  color: string;
  strokeWidth: number;
  opacity: number;
  timestamp: number;
};

// 스택 데이터 구조
type ActionData = {
  type: 'draw' | 'erase';
  pathData: PathData;
};

// 상수
const ERASER_RADIUS = 10;
const MAX_STACK_SIZE = 10; // 최대 스택 크기

// 압축과 전송을 처리하는 함수 정의
const sendCompressedData = (socket: Socket, event: string, data: any) => {
  const compressedData = pako.deflate(JSON.stringify(data));
  socket.emit(event, compressedData);
};

// Throttle 적용
const throttledSendData = throttle(sendCompressedData, 100); // 1초마다 최대 1회 전송

function LeftCanvasSection({
  socket,
  onRecordingEnd,
}: LeftCanvasSectionProps): React.JSX.Element {
  const canvasRef = useCanvasRef();
  const [pathGroups, setPathGroups] = useState<PathData[][]>([]);
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
  const [isRecording, setIsRecording] = useState(false);

  // 녹화 데이터 저장
  const recordedPathsRef = useRef<PathData[]>([]);

  useEffect(() => {
    if (isRecording) {
      recordedPathsRef.current = []; // 녹화 시작 시 초기화
    }
  }, [isRecording]);

  const togglePenOpacity = () => {
    setPenOpacity(prevOpacity => (prevOpacity === 1 ? 0.4 : 1)); // 형광펜 효과
  };

  const toggleEraserMode = () => setIsErasing(!isErasing); // 지우개 모드 토글

  // 경로 병합 함수
  const mergePaths = (pathsToMerge: PathData[]) => {
    const mergedPathString = pathsToMerge
      .map(p => p.path.toSVGString())
      .join(' ');
    return Skia.Path.MakeFromSVGString(mergedPathString); // 병합된 SVG 경로로 Path 생성
  };

  // 새로운 경로를 그룹에 추가하는 함수
  const addPathToGroup = (newPath: PathData) => {
    setPathGroups(prevGroups => {
      const lastGroup = prevGroups[prevGroups.length - 1];

      if (
        lastGroup &&
        lastGroup.length > 0 &&
        lastGroup[0].color === newPath.color &&
        lastGroup[0].strokeWidth === newPath.strokeWidth &&
        lastGroup[0].opacity === newPath.opacity
      ) {
        // 스타일이 같으면 병합
        lastGroup.push(newPath);
        const mergedPath = mergePaths(lastGroup);
        const mergedPathData: PathData = {
          path: mergedPath,
          color: newPath.color,
          strokeWidth: newPath.strokeWidth,
          opacity: newPath.opacity,
          timestamp: lastGroup[0].timestamp,
        };
        return [...prevGroups.slice(0, -1), [mergedPathData]];
      } else {
        // 스타일이 다르면 새 그룹 시작
        return [...prevGroups, [newPath]];
      }
    });
  };

  const erasePath = (x: number, y: number) => {
    setPathGroups(prevGroups =>
      prevGroups
        .map(group =>
          group.filter(pathData => {
            const bounds = pathData.path.getBounds();
            const dx = Math.max(bounds.x - x, x - (bounds.x + bounds.width), 0);
            const dy = Math.max(
              bounds.y - y,
              y - (bounds.y + bounds.height),
              0,
            );
            const isInEraseArea =
              dx * dx + dy * dy < ERASER_RADIUS * ERASER_RADIUS;

            if (isInEraseArea) {
              addToUndoStack({type: 'erase', pathData});
            }
            return !isInEraseArea;
          }),
        )
        .filter(group => group.length > 0),
    );
    setRedoStack([]);
  };

  const addToUndoStack = (action: ActionData) => {
    setUndoStack(prevUndoStack => {
      const newUndoStack = [...prevUndoStack, action];
      if (newUndoStack.length > MAX_STACK_SIZE) {
        newUndoStack.shift();
      }
      return newUndoStack;
    });
  };

  const addToRedoStack = (action: ActionData) => {
    setRedoStack(prevRedoStack => {
      const newRedoStack = [...prevRedoStack, action];
      if (newRedoStack.length > MAX_STACK_SIZE) {
        newRedoStack.shift();
      }
      return newRedoStack;
    });
  };

  const undo = () => {
    if (undoStack.length === 0) {
      return;
    }

    const lastAction = undoStack[undoStack.length - 1];
    setUndoStack(undoStack.slice(0, -1));

    if (lastAction.type === 'draw') {
      setPathGroups(pathGroups.slice(0, -1));
      addToRedoStack(lastAction);
    } else if (lastAction.type === 'erase') {
      setPathGroups([...pathGroups, [lastAction.pathData]]);
      addToRedoStack(lastAction);
    }
  };

  const redo = () => {
    if (redoStack.length === 0) {
      return;
    }

    const lastRedoAction = redoStack[redoStack.length - 1];
    setRedoStack(redoStack.slice(0, -1));

    if (lastRedoAction.type === 'draw') {
      addPathToGroup(lastRedoAction.pathData);
      addToUndoStack(lastRedoAction);
    } else if (lastRedoAction.type === 'erase') {
      setPathGroups(prevGroups =>
        prevGroups.map(group =>
          group.filter(pathData => pathData !== lastRedoAction.pathData),
        ),
      );
      addToUndoStack(lastRedoAction);
    }
  };

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
      const pathData = {
        path: currentPath.toSVGString(),
        color: penColor,
        strokeWidth: penSize,
        opacity: penOpacity,
        timestamp: Date.now(),
      };
      if (isRecording) {
        recordedPathsRef.current.push(pathData);
      }
      throttledSendData(socket, 'left_to_right_move', pathData);
    }
  };

  const handleTouchEnd = () => {
    if (isErasing) {
      setEraserPosition(null);
    } else if (currentPath) {
      const newPathData = {
        path: currentPath,
        color: penColor,
        strokeWidth: penSize,
        opacity: penOpacity,
        timestamp: Date.now(),
      };
      if (isRecording) {
        recordedPathsRef.current.push(newPathData);
      }
      addPathToGroup(newPathData);
      addToUndoStack({type: 'draw', pathData: newPathData});
      setCurrentPath(null);
      setRedoStack([]);
    }
  };

  const startRecording = () => setIsRecording(true);
  const stopRecording = () => {
    setIsRecording(false);
    onRecordingEnd(recordedPathsRef.current);
  };

  return (
    <CanvasDrawingTool
      canvasRef={canvasRef}
      paths={pathGroups.flat()}
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
      isRecording={isRecording}
      startRecording={startRecording}
      stopRecording={stopRecording}
    />
  );
}

export default LeftCanvasSection;
