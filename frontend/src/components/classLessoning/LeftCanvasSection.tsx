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
  console.log('압축 데이터', compressedData);

  socket.emit(event, compressedData);
};

// Throttle 적용
const throttledSendData = throttle(sendCompressedData, 100); // 1초마다 최대 1회 전송

function LeftCanvasSection({
  socket,
  onRecordingEnd,
}: LeftCanvasSectionProps): React.JSX.Element {
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
    console.log('변경완료');
  };

  const toggleEraserMode = () => setIsErasing(!isErasing); // 지우개 모드 토글

  const erasePath = (x: number, y: number) => {
    setPaths(prevPaths =>
      prevPaths.filter(pathData => {
        const bounds = pathData.path.getBounds();
        const dx = Math.max(bounds.x - x, x - (bounds.x + bounds.width), 0);
        const dy = Math.max(bounds.y - y, y - (bounds.y + bounds.height), 0);
        const isInEraseArea = dx * dx + dy * dy < ERASER_RADIUS * ERASER_RADIUS;

        if (isInEraseArea) {
          addToUndoStack({type: 'erase', pathData});
        }
        return !isInEraseArea;
      }),
    );
    setRedoStack([]); // 새로운 작업 발생 시 redo 스택 초기화
  };

  // 스택에 항목 추가 및 최대 크기 유지하는 함수
  const addToUndoStack = (action: ActionData) => {
    setUndoStack(prevUndoStack => {
      const newUndoStack = [...prevUndoStack, action];
      if (newUndoStack.length > MAX_STACK_SIZE) {
        newUndoStack.shift();
      } // 오래된 항목 제거
      return newUndoStack;
    });
  };

  const addToRedoStack = (action: ActionData) => {
    setRedoStack(prevRedoStack => {
      const newRedoStack = [...prevRedoStack, action];
      if (newRedoStack.length > MAX_STACK_SIZE) {
        newRedoStack.shift();
      } // 오래된 항목 제거
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
      setPaths(paths.slice(0, -1)); // 마지막 경로 제거
      addToRedoStack(lastAction); // redo 스택에 추가
    } else if (lastAction.type === 'erase') {
      setPaths([...paths, lastAction.pathData]); // 지운 경로 복구
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
      setPaths([...paths, lastRedoAction.pathData]); // 경로 다시 추가
      addToUndoStack(lastRedoAction);
    } else if (lastRedoAction.type === 'erase') {
      setPaths(paths.filter(pathData => pathData !== lastRedoAction.pathData)); // 지우기 작업 반복
      addToUndoStack(lastRedoAction);
    }
  };

  useEffect(() => {
    socket.on('connect', () => {
      console.log('왼쪽 캔버스 서버에 연결됨:', socket.id);
    });
    socket.on('disconnect', () => {
      console.log('서버 연결이 해제되었습니다.');
    });
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
            timestamp: data.timestamp,
          },
        ]);
      }
    });
    return () => {
      socket.off('right_to_left');
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
      const pathData = {
        path: currentPath.toSVGString(),
        color: penColor,
        strokeWidth: penSize,
        opacity: penOpacity,
        timestamp: Date.now(),
      };
      if (isRecording) {
        recordedPathsRef.current.push(pathData);
      } // 녹화 데이터 추가
      console.log('TOSVGSTrign', pathData.path);

      throttledSendData(socket, 'left_to_right_move', pathData);
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
      if (isRecording) {
        recordedPathsRef.current.push(newPathData);
      }

      addToUndoStack({type: 'draw', pathData: newPathData});

      socket.emit('left_to_right', {
        pathString,
        color: penColor,
        strokeWidth: penSize,
        opacity: penOpacity,
        timestamp: Date.now(),
      });
      setPaths(prevPaths => [...prevPaths, newPathData]);
      setCurrentPath(null);
      setRedoStack([]);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
    console.log('부모 컴포넌트로 녹화된 경로 전달:', recordedPathsRef.current);

    onRecordingEnd(recordedPathsRef.current);
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
      isRecording={isRecording}
      startRecording={startRecording}
      stopRecording={stopRecording}
    />
  );
}

export default LeftCanvasSection;
