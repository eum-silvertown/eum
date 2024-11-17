import React, { useEffect, useState } from 'react';
import { Skia, useCanvasRef } from '@shopify/react-native-skia';
import CanvasDrawingTool from '@components/common/CanvasDrawingTool';
import StudentInteractionTool from './StudentInteractionTool';
import pako from 'pako';
import base64 from 'react-native-base64';
import { Alert } from 'react-native';
import { useLessonStore } from '@store/useLessonStore';
import { useAuthStore } from '@store/useAuthStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { ExamProblemSubmission, submitExamProblems } from '@services/examService';

interface StudentCanvasSectionProps {
  solveType: 'EXAM' | 'HOMEWORK'
  examId: number;
  questionIds: number[];
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  problemsCnt: number;
  problems: {
    content: string;
    answer: string; // 정답 데이터 포함
  }[];
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

// 숙제 제출 문제 상태
type QuestionResponse = {
  questionId: number;
  studentId: number;
  isCorrect: boolean;
  examSolution: PathData[];
  answerText?: string;
};

// 상수
const ERASER_RADIUS = 10;
const MAX_STACK_SIZE = 5;

const StudentExamCanvasSection = ({
  solveType,
  examId,
  questionIds,
  currentPage,
  setCurrentPage,
  problemsCnt,
  problems,
}: StudentCanvasSectionProps): React.JSX.Element => {
  const memberId = useAuthStore(state => state.userInfo.id);
  const lectureId = useLessonStore(state => state.lectureId);
  const queryClient = useQueryClient();
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
  const navigate = useNavigation();
  const [questionResponses, setQuestionResponses] = useState<QuestionResponse[]>([]);
  const [answerText, setAnswerText] = useState<string>('');

  useEffect(() => {
    // 초기화: problemsCnt 크기의 기본 배열 생성
    setQuestionResponses(
      Array.from({ length: problemsCnt }, (_, index) => ({
        questionId: questionIds[index],
        studentId: memberId,
        isCorrect: false,
        examSolution: [],
        answerText: '',
      }))
    );
  }, [problemsCnt, questionIds, memberId]);

  // 숙제 제출 Mutation
  const { mutate: submitExamMutation } = useMutation({
    mutationFn: (submissionData: ExamProblemSubmission) =>
      submitExamProblems(examId, submissionData),
    onSuccess: () => {
      Alert.alert('제출 완료', '숙제가 성공적으로 제출되었습니다.');
      queryClient.invalidateQueries({
        queryKey: ['examSubmissionList'],
      });
      queryClient.invalidateQueries({
        queryKey: ['lectureDetail', lectureId],
      });
      navigate.goBack();
    },
    onError: () => {
      Alert.alert('제출 실패', '숙제를 제출하는데 실패했습니다.');
    },
  });

  useEffect(() => {
    // 페이지 변경 시 데이터를 로드
    const currentResponse = questionResponses[currentPage - 1];
    if (currentResponse) {
      setPaths(currentResponse.examSolution);
      setAnswerText(currentResponse.answerText || '');
    } else {
      setPaths([]);
      setAnswerText('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    setQuestionResponses((prevResponses) => {
      const updatedResponses = [...prevResponses];
      if (updatedResponses[currentPage - 1]) {
        updatedResponses[currentPage - 1] = {
          ...updatedResponses[currentPage - 1],
          examSolution: paths,
        };
      }
      return updatedResponses;
    });
  }, [paths, currentPage]);

  useEffect(() => {
    const currentResponse = questionResponses[currentPage - 1];
    setAnswerText(currentResponse?.answerText || ''); // 페이지에 맞는 답변 불러오기
  }, [currentPage, questionResponses]);

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

  const handleSaveAnswer = (newAnswerText: string) => {
    setQuestionResponses((prevResponses) => {
      const updatedResponses = [...prevResponses];
      updatedResponses[currentPage - 1] = {
        ...updatedResponses[currentPage - 1],
        answerText: newAnswerText, // 현재 답변 저장
      };
      return updatedResponses;
    });
  };

  const handleSubmit = () => {
    const encodedResponses: ExamProblemSubmission = questionResponses.map((response, index) => {
      const correctAnswer = problems[index]?.answer || ''; // 정답 기본값 설정
      return {
        questionId: response.questionId,
        studentId: response.studentId,
        isCorrect: (response.answerText?.trim() || '') === correctAnswer.trim(), // 공백 제거 후 비교
        examSolution: encodePathsToSolution(response.examSolution),
      };
    });
    submitExamMutation(encodedResponses);
  };

  const onNextPage = () => {
    if (currentPage < problemsCnt) {
      handleSaveAnswer(answerText); // 현재 답변 저장
      setCurrentPage((prev) => prev + 1); // 다음 페이지로 이동
    }
  };

  const onPrevPage = () => {
    if (currentPage > 1) {
      handleSaveAnswer(answerText); // 현재 답변 저장
      setCurrentPage((prev) => prev - 1); // 이전 페이지로 이동
    }
  };

  const mergeSimilarPaths = (newPaths: PathData[]): PathData[] => {
    const mergedPaths: PathData[] = [];
    newPaths.forEach((saveCurrentPath) => {
      const lastMergedPath = mergedPaths[mergedPaths.length - 1];
      if (
        lastMergedPath &&
        lastMergedPath.color === saveCurrentPath.color &&
        lastMergedPath.strokeWidth === saveCurrentPath.strokeWidth &&
        lastMergedPath.opacity === saveCurrentPath.opacity
      ) {
        const mergedPathString =
          lastMergedPath.path.toSVGString() +
          ' ' +
          saveCurrentPath.path.toSVGString();
        const mergedPath = Skia.Path.MakeFromSVGString(mergedPathString);
        if (mergedPath) {
          lastMergedPath.path = mergedPath;
        }
      } else {
        mergedPaths.push(saveCurrentPath);
      }
    });
    return mergedPaths;
  };

  const encodePathsToSolution = (pathData: PathData[]): string => {
    const mergedPaths = mergeSimilarPaths(pathData);
    const svgPaths = mergedPaths.map(({ path, color, strokeWidth, opacity }) => ({
      path: path.toSVGString(),
      color,
      strokeWidth,
      opacity,
    }));
    const compressedData = pako.deflate(JSON.stringify(svgPaths));
    return base64.encode(String.fromCharCode(...new Uint8Array(compressedData)));
  };


  const handleSetPenColor = (color: string) => {
    if (isErasing) {
      setIsErasing(false);
    }
    setPenColor(color);
  };

  const handleSetPenSize = (size: number) => {
    if (isErasing) {
      setIsErasing(false);
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
      <StudentInteractionTool
        solveType={solveType}
        currentPage={currentPage}
        totalPages={problemsCnt}
        onNextPage={onNextPage}
        onPrevPage={onPrevPage}
        onSubmit={handleSubmit}
        setAnswer={handleSaveAnswer}
        answerText={questionResponses[currentPage - 1]?.answerText || ''}
      />
    </>
  );
};

export default StudentExamCanvasSection;
