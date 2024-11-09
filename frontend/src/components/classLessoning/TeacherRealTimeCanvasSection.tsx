import React, { useEffect, useState } from 'react';
import { Skia, useCanvasRef } from '@shopify/react-native-skia';
import CanvasDrawingTool from './CanvasDrawingTool';
import { Socket } from 'socket.io-client';
import base64 from 'react-native-base64';
import pako from 'pako';
import { throttle } from 'lodash';
import TeacherLessoningInteractionTool from './TeacherLessoningInteractionTool';

interface TeacherCanvasSectionProps {
  socket: Socket;
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

// 압축 전송 함수
const sendCompressedData = (socket: Socket, event: string, data: any, count: number) => {
  const compressedData = pako.deflate(JSON.stringify(data));
  const base64EncodedData = base64.encode(String.fromCharCode(...compressedData));
  socket.emit(event, base64EncodedData);

  // 전송 로그에 카운터 추가
  console.log(`[Socket Sync] Event: ${event} | Count: ${count} | Data Length: ${data.length}`);
};

const TeacherCanvasSection = ({
  socket,
  currentPage,
  totalPages,
  onNextPage,
  onPrevPage,
}: TeacherCanvasSectionProps): React.JSX.Element => {
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

  // 실시간 전송 - Move 시
  const throttledSendData = throttle((pathData: PathData) => {
    syncMoveCount += 1;
    sendCompressedData(socket, 'left_to_right_move', pathData, syncMoveCount);
    console.log(`[Socket Sync] 실시간 전송(sync_move) | Count: ${syncMoveCount} | Path Data:`, pathData);
  }, 100); // 100ms마다 전송

  useEffect(() => {
    syncCount += 1;
    const dataToSend = paths.map(pathData => ({
      ...pathData,
      path: pathData.path.toSVGString(),
    }));
    sendCompressedData(socket, 'left_to_right', dataToSend, syncCount);
    console.log(`[Paths Updated] Sync 전송 횟수: ${syncCount} | paths 개수: ${paths.length}`);
  }, [paths, socket]);

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
    setPaths(prevPaths => {
      let pathDeleted = false; // 삭제 여부 확인

      const newPaths = prevPaths.filter(pathData => {
        const bounds = pathData.path.getBounds();
        const dx = Math.max(bounds.x - x, x - (bounds.x + bounds.width), 0);
        const dy = Math.max(bounds.y - y, y - (bounds.y + bounds.height), 0);
        const isInEraseArea = dx * dx + dy * dy < ERASER_RADIUS * ERASER_RADIUS;

        // 개별 경로로 지우기 작업 수행
        if (isInEraseArea) {
          pathDeleted = true; // 경로 삭제 플래그 설정
          addToUndoStack({ type: 'erase', pathData });
          console.log('지우개로 개별 경로 삭제:', pathData); // 디버깅 로그
        }
        return !isInEraseArea; // 삭제 대상이 아닌 경우만 남김
      });

      if (pathDeleted) {
        setRedoStack([]); // redo 스택 초기화
        return newPaths;
      }

      return prevPaths; // 삭제된 경로가 없으면 이전 상태 반환
    });
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
    if (undoStack.length === 0) return;

    const lastAction = undoStack[undoStack.length - 1];
    setUndoStack(undoStack.slice(0, -1));

    if (lastAction.type === 'draw') {
      setPaths(paths.slice(0, -1));
    } else if (lastAction.type === 'erase') {
      setPaths([...paths, lastAction.pathData]);
    }
    addToRedoStack(lastAction);
    console.log('Undo 수행:', lastAction); // 디버깅 로그
  };

  const redo = () => {
    if (redoStack.length === 0) return;

    const lastRedoAction = redoStack[redoStack.length - 1];
    setRedoStack(redoStack.slice(0, -1));

    if (lastRedoAction.type === 'draw') {
      addPath(lastRedoAction.pathData);
    } else if (lastRedoAction.type === 'erase') {
      setPaths(paths.filter(pathData => pathData !== lastRedoAction.pathData));
    }
    addToUndoStack(lastRedoAction);
    console.log('Redo 수행:', lastRedoAction); // 디버깅 로그
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
      console.log(pathData);

      throttledSendData(pathData); // 실시간 전송 (throttle 적용)
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
      setRedoStack([]); // redo 스택 초기화
      // console.log('[Path Added] New path 추가됨:', newPathData);
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
      <TeacherLessoningInteractionTool
        currentPage={currentPage}
        totalPages={totalPages}
        onNextPage={onNextPage}
        onPrevPage={onPrevPage}
      />
    </>
  );
};

export default TeacherCanvasSection;
