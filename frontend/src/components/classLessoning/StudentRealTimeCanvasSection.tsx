import React, { useEffect, useState } from 'react';
import { Skia, useCanvasRef } from '@shopify/react-native-skia';
import CanvasDrawingTool from './CanvasDrawingTool';
import base64 from 'react-native-base64';
import pako from 'pako';
import { throttle } from 'lodash';
import StudentLessoningInteractionTool from './StudentLessoningInteractionTool';
import StudentRealTimeCanvasRefSection from './StudentRealTimeCanvasRefSection';
import * as StompJs from '@stomp/stompjs';
interface StudentCanvasSectionProps {
  role: string;
  token: string;
  clientRef: React.MutableRefObject<StompJs.Client | null>;
  isConnected: boolean;
  sendMessage: () => void;
  receivedMessage: string | null;
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPrevPage: () => void;
}

// Path 데이터 구조
type PathData = {
  path: any;
  color: string;
  strokeWidth: number;
  opacity: number;
};

// 스택 데이터 구조
type ActionData = {
  type: 'draw' | 'erase';
  pathData: PathData;
};

// 상수
const ERASER_RADIUS = 10;
const MAX_STACK_SIZE = 5;

// 전송 확인 카운트
let syncCount = 0;
let syncMoveCount = 0;


const StudentRealTimeCanvasSection = ({
  role,
  token,
  clientRef,
  currentPage,
  totalPages,
  onNextPage,
  onPrevPage,
  receivedMessage,
}: StudentCanvasSectionProps): React.JSX.Element => {
  const canvasRef = useCanvasRef();
  const [paths, setPaths] = useState<PathData[]>([]);
  const [currentPath, setCurrentPath] = useState<any | null>(null);
  const [penColor, setPenColor] = useState('#000000');
  const [penSize, setPenSize] = useState(2);
  const [penOpacity, setPenOpacity] = useState(1);
  const [undoStack, setUndoStack] = useState<ActionData[]>([]);
  const [redoStack, setRedoStack] = useState<ActionData[]>([]);
  const [eraserPosition, setEraserPosition] = useState<{ x: number; y: number } | null>(null);
  const [isErasing, setIsErasing] = useState(false);
  const [isTeacherScreenOn, setIsTeacherScreenOn] = useState(false);

  // 압축 전송
  const sendCompressedData = (destination: string, data: any, count: number) => {
    if (!clientRef.current || !clientRef.current.active) {
      console.log('STOMP client is not connected');
      return;
    }
    const compressedData = pako.deflate(JSON.stringify(data));
    const base64EncodedData = base64.encode(String.fromCharCode(...compressedData));
    const newPayload = {
      memberId: 63,
      role: role,
      lessonId: 37,
      questionId: 1,
      drawingData: base64EncodedData,
    };

    clientRef.current.publish({
      destination,
      headers: {
        Authorization: `${token}`,
      },
      body: JSON.stringify(newPayload),
    });

    console.log(`[STOMP Sync] Destination: ${destination} | Count: ${count} | Data Length: ${data.length}`);
  };

  // 화면 전환 토글
  const handleToggleScreen = () => {
    setIsTeacherScreenOn(prev => !prev);
  };

  // 실시간 전송 - Move 시
  const throttledSendData = throttle((pathData: PathData) => {
    syncMoveCount += 1;
    sendCompressedData('/app/move', pathData, syncMoveCount);
    console.log(`[Socket Sync] 실시간 전송(sync_move) | Count: ${syncMoveCount} | Path Data:`, pathData);
  }, 400); // 200ms마다 전송

  useEffect(() => {
    syncCount += 1;
    const dataToSend = paths.map(pathData => ({
      ...pathData,
      path: pathData.path.toSVGString(),
    }));

    // STOMP 전송 함수 호출
    sendCompressedData('/app/draw', dataToSend, syncCount);
    console.log(`[Paths Updated] Sync 전송 횟수: ${syncCount} | paths 개수: ${paths.length}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paths, clientRef]);

  const togglePenOpacity = () => {
    setPenOpacity(prevOpacity => (prevOpacity === 1 ? 0.4 : 1));
  };

  const toggleEraserMode = () => {
    setIsErasing(!isErasing);
  };

  const addPath = (newPath: PathData) => {
    setPaths(prevPaths => [...prevPaths, newPath]);
  };

  const erasePath = (x: number, y: number) => {
    setPaths(prevPaths =>
      prevPaths.filter(pathData => {
        const bounds = pathData.path.getBounds();
        const dx = Math.max(bounds.x - x, x - (bounds.x + bounds.width), 0);
        const dy = Math.max(bounds.y - y, y - (bounds.y + bounds.height), 0);
        const isInEraseArea = dx * dx + dy * dy < ERASER_RADIUS * ERASER_RADIUS;

        if (isInEraseArea) {
          addToUndoStack({ type: 'erase', pathData });
          console.log('지우개로 경로 삭제:', pathData);
        }
        return !isInEraseArea;
      }),
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

  const undo = () => {
    if (undoStack.length === 0) { return; }

    const lastAction = undoStack[undoStack.length - 1];
    setUndoStack(undoStack.slice(0, -1));

    if (lastAction.type === 'draw') {
      setPaths(paths.slice(0, -1));
    } else if (lastAction.type === 'erase') {
      setPaths([...paths, lastAction.pathData]);
    }
    addToRedoStack(lastAction);
    console.log('Undo 수행:', lastAction);
  };

  const redo = () => {
    if (redoStack.length === 0) { return; }

    const lastRedoAction = redoStack[redoStack.length - 1];
    setRedoStack(redoStack.slice(0, -1));

    if (lastRedoAction.type === 'draw') {
      addPath(lastRedoAction.pathData);
    } else if (lastRedoAction.type === 'erase') {
      setPaths(paths.filter(pathData => pathData !== lastRedoAction.pathData));
    }
    addToUndoStack(lastRedoAction);
    console.log('Redo 수행:', lastRedoAction);
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

  const handleTouchStart = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    if (isErasing) {
      setEraserPosition({ x: locationX, y: locationY });
      erasePath(locationX, locationY);
    } else {
      const newPath = Skia.Path.Make();
      newPath.moveTo(locationX, locationY);
      setCurrentPath(newPath);
    }
  };

  const handleTouchMove = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    if (isErasing) {
      setEraserPosition({ x: locationX, y: locationY });
      erasePath(locationX, locationY);
    } else if (currentPath) {
      currentPath.lineTo(locationX, locationY);
      canvasRef.current?.redraw();
      const pathData = {
        path: currentPath.toSVGString(),
        color: penColor,
        strokeWidth: penSize,
        opacity: penOpacity,
      };
      throttledSendData(pathData);
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
      };
      addPath(newPathData);
      addToUndoStack({ type: 'draw', pathData: newPathData });
      setCurrentPath(null);
      setRedoStack([]);
      syncCount = 0;
      syncMoveCount = 0;
    }
  };

  const handleSetPenColor = (color: string) => {
    if (isErasing) {
      setIsErasing(false); // 지우개 모드를 비활성화
    }
    setPenColor(color);
  };

  const handleSetPenSize = (size: number) => {
    if (isErasing) {
      setIsErasing(false); // 지우개 모드를 비활성화
    }
    setPenSize(size);
  };

  return (
    <>
      {isTeacherScreenOn && <StudentRealTimeCanvasRefSection receivedMessage={receivedMessage} />}
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
        setPenColor={handleSetPenColor}
        setPenSize={handleSetPenSize}
        togglePenOpacity={togglePenOpacity}
        undo={undo}
        redo={redo}
        undoStack={undoStack.length}
        redoStack={redoStack.length}
        toggleEraserMode={toggleEraserMode}
        isErasing={isErasing}
        eraserPosition={eraserPosition}
      />
      <StudentLessoningInteractionTool
        currentPage={currentPage}
        totalPages={totalPages}
        onNextPage={onNextPage}
        onPrevPage={onPrevPage}
        onToggleScreen={handleToggleScreen}
      />
    </>
  );
};

export default StudentRealTimeCanvasSection;
