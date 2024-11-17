import React, { useEffect, useState } from 'react';
import { Skia, useCanvasRef } from '@shopify/react-native-skia';
import CanvasDrawingTool from '../common/CanvasDrawingTool';
import base64 from 'react-native-base64';
import pako from 'pako';
import TeacherLessoningInteractionTool from './TeacherLessoningInteractionTool';
import * as StompJs from '@stomp/stompjs';
import TeacherRealTimeCanvasRefSection from './TeacherRealTimeCanvasRefSection';
import { useLectureStore, useLessonStore } from '@store/useLessonStore';
import { Alert, Dimensions } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getTeacherDrawingData } from '@services/lessonService';

interface TeacherCanvasSectionProps {
  problemIds: number[];
  answers: string[];
  titles: string[];
  isTeaching: boolean | null;
  role: string;
  clientRef: React.MutableRefObject<StompJs.Client | null>;
  isConnected: boolean;
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

const TeacherRealTimeCanvasSection = ({
  problemIds,
  answers,
  titles,
  isTeaching,
  role,
  clientRef,
  currentPage,
  totalPages,
  onNextPage,
  onPrevPage,
  receivedMessage,
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
  const roundToTwoDecimals = (value: number): number => {
    return Math.round(value * 100) / 100;
  };
  const teacherId = useLectureStore(state => state.teacherId);
  const lessonId = useLessonStore(state => state.lessonId);
  const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

  const width = parseFloat(deviceWidth.toFixed(8));
  const height = parseFloat(deviceHeight.toFixed(8));

  // 압축 전송
  const sendCompressedData = (destination: string, data: any) => {
    if (!clientRef.current || !clientRef.current.active || !clientRef.current.connected) {
      console.log('STOMP client is not connected');
      return;
    }

    const compressedData = pako.deflate(JSON.stringify(data));
    const base64EncodedData = base64.encode(
      String.fromCharCode(...compressedData),
    );
    const newPayload = {
      memberId: teacherId,
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
  const resetCanvasState = () => {
    setPaths([]);
    setUndoStack([]);
    setRedoStack([]);
    console.log('Canvas 상태 초기화 완료');
  };

  // 페이지 이동 핸들러 수정
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      resetCanvasState(); // 상태 초기화
      onNextPage(); // 부모에서 전달된 페이지 이동 함수 호출
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      resetCanvasState(); // 상태 초기화
      onPrevPage(); // 부모에서 전달된 페이지 이동 함수 호출
    }
  };

  // 선생님 그림 데이터 가져오기
  const { data: teacherDrawingData } = useQuery({
    queryKey: ['teacherDrawing', teacherId, lessonId, problemIds[currentPage - 1]],
    queryFn: async () => {
      if (teacherId && lessonId && problemIds[currentPage - 1]) {
        return getTeacherDrawingData(teacherId, lessonId, problemIds[currentPage - 1]);
      }
      return null;
    },
    enabled: !!(teacherId && lessonId && problemIds[currentPage - 1]), // 데이터가 존재할 때만 요청
  });

  useEffect(() => {
    if (teacherDrawingData) {
      processCanvasData(teacherDrawingData.drawingData);
    }
  }, [teacherDrawingData]);

  // teacherDrawingData가 변경되었을 때 paths 설정
  useEffect(() => {
    if (teacherDrawingData) {
      resetCanvasState(); // 상태 초기화
      processCanvasData(teacherDrawingData.drawingData);
      console.log('데이터 가져옴');

    }
  }, [teacherDrawingData, currentPage]);

  const processCanvasData = (base64EncodedData: string) => {
    try {
      const binaryString = base64.decode(base64EncodedData);
      const compressedData = Uint8Array.from(
        binaryString.split('').map(char => char.charCodeAt(0)),
      );
      const decompressedData = JSON.parse(
        pako.inflate(compressedData, { to: 'string' }),
      );

      const parsedPaths = decompressedData
        .map((pathData: any) => {
          const pathString = pathData.path;
          const path = Skia.Path.MakeFromSVGString(pathString);
          return path ? { ...pathData, path } : null;
        })
        .filter(Boolean);

      setPaths(parsedPaths);
    } catch (error) {
      console.error('Failed to decompress or parse data:', error);
    }
  };

  useEffect(() => {
    const dataToSend = paths.map(pathData => ({
      ...pathData,
      path: pathData.path.toSVGString(),
    }));

    // STOMP 전송 함수 호출
    sendCompressedData('/app/draw', dataToSend);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paths, clientRef]);

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
    console.log('Undo 수행:', lastAction); // 디버깅 로그
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
      {isTeaching && (
        <TeacherRealTimeCanvasRefSection receivedMessage={receivedMessage} />
      )}
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
      <TeacherLessoningInteractionTool
        answers={answers}
        titles={titles}
        currentPage={currentPage}
        totalPages={totalPages}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
      />
    </>
  );
};

export default TeacherRealTimeCanvasSection;
