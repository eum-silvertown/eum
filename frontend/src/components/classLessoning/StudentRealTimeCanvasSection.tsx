import React, { useEffect, useState } from 'react';
import { Skia, useCanvasRef } from '@shopify/react-native-skia';
import CanvasDrawingTool from '../common/CanvasDrawingTool';
import base64 from 'react-native-base64';
import pako from 'pako';
import StudentLessoningInteractionTool from './StudentLessoningInteractionTool';
import StudentRealTimeCanvasRefSection from './StudentRealTimeCanvasRefSection';
import * as StompJs from '@stomp/stompjs';
import { useLectureStore } from '@store/useLessonStore';
import { Alert, Dimensions } from 'react-native';
import { useLessoningStore } from '@store/useLessoningStore';
interface StudentCanvasSectionProps {
  problemIds: number[];
  answers: string[];
  titles: string[];
  lessonId: number;
  role: string;
  clientRef: React.MutableRefObject<StompJs.Client | null>;
  isConnected: boolean;
  receivedMessage: string | null;
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPrevPage: () => void;
  handleGoToTeacherScreen: () => void;
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

const StudentRealTimeCanvasSection = ({
  problemIds,
  answers,
  titles,
  lessonId,
  role,
  clientRef,
  currentPage,
  totalPages,
  onNextPage,
  onPrevPage,
  handleGoToTeacherScreen,
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
  const [eraserPosition, setEraserPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isErasing, setIsErasing] = useState(false);
  const [isTeacherScreenOn, setIsTeacherScreenOn] = useState(false);

  const roundToTwoDecimals = (value: number): number => {
    return Math.round(value * 100) / 100;
  };
  const setLessoningInfo = useLessoningStore(state => state.setLessoningInfo);
  useEffect(() => {
    if (receivedMessage) {
      try {
        const messageObject = JSON.parse(receivedMessage);

        const {
          memberId,
          lessonId,
          questionId,
        } = messageObject;

        console.log('파싱된 메시지:', {
          memberId,
          lessonId,
          questionId,
        });

        // Zustand 상태 업데이트
        setLessoningInfo(memberId, lessonId, questionId);

      } catch (error) {
        console.error('receivedMessage 파싱 오류:', error);
      }
    }
  }, [receivedMessage, setLessoningInfo]);

  const memberId = useLectureStore(state => state.memberId);
  const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');
  const width = parseFloat(deviceWidth.toFixed(8));
  const height = parseFloat(deviceHeight.toFixed(8));
  // 압축 전송
  const sendCompressedData = (destination: string, data: any) => {
    if (!clientRef.current || !clientRef.current.active) {
      console.log('STOMP client is not connected');
      return;
    }
    const compressedData = pako.deflate(JSON.stringify(data));
    const base64EncodedData = base64.encode(
      String.fromCharCode(...compressedData),
    );
    const newPayload = {
      memberId: memberId,
      role: role,
      lessonId: lessonId,
      questionId: problemIds[currentPage - 1],
      drawingData: base64EncodedData,
      width,
      height,
    };

    clientRef.current.publish({
      destination,
      body: JSON.stringify(newPayload),
    });
  };

  // 화면 전환 토글
  const handleToggleScreen = () => {
    setIsTeacherScreenOn(prev => !prev);
  };

  useEffect(() => {
    const dataToSend = paths.map(pathData => ({
      ...pathData,
      path: pathData.path.toSVGString(),
    }));

    // STOMP 전송 함수 호출
    sendCompressedData('/app/draw', dataToSend);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paths]);

  const togglePenOpacity = () => {
    if (isErasing) {
      setIsErasing(false); // 지우개 모드를 비활성화
    }
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
    if (undoStack.length === 0) {
      return;
    }

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
    if (redoStack.length === 0) {
      return;
    }

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
    const locationX = roundToTwoDecimals(event.nativeEvent.locationX);
    const locationY = roundToTwoDecimals(event.nativeEvent.locationY);
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
    const locationX = roundToTwoDecimals(event.nativeEvent.locationX);
    const locationY = roundToTwoDecimals(event.nativeEvent.locationY);
    if (isErasing) {
      setEraserPosition({ x: locationX, y: locationY });
      erasePath(locationX, locationY);
    } else if (currentPath) {
      // 현재 경로에 새로운 포인트 추가
      currentPath.lineTo(
        Math.round(locationX * 100) / 100, // 좌표 정밀도 소수점 두 자리로 제한
        Math.round(locationY * 100) / 100,
      );
      canvasRef.current?.redraw();
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

  const resetPaths = () => {
    Alert.alert(
      '초기화 확인',
      '정말 초기화하시겠습니까? 초기화하면 모든 필기 정보가 삭제됩니다.',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '초기화',
          onPress: () => {
            setPaths([]);
            setUndoStack([]);
            setRedoStack([]);
            console.log('Canvas 초기화 완료');
          },
          style: 'destructive',
        },
      ],
    );
  };

  return (
    <>
      <StudentRealTimeCanvasRefSection receivedMessage={receivedMessage} isTeacherScreenOn={isTeacherScreenOn} />
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
        resetPaths={resetPaths}
      />
      <StudentLessoningInteractionTool
        problemIds={problemIds}
        answers={answers}
        titles={titles}
        currentPage={currentPage}
        totalPages={totalPages}
        onNextPage={onNextPage}
        onPrevPage={onPrevPage}
        onToggleScreen={handleToggleScreen}
        handleGoToTeacherScreen={handleGoToTeacherScreen}
      />
    </>
  );
};

export default StudentRealTimeCanvasSection;
