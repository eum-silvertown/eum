import React, { useState } from 'react';
import { Skia, useCanvasRef } from '@shopify/react-native-skia';
import CanvasDrawingTool from '@components/common/CanvasDrawingTool';
import StudentInteractionTool from './StudentInteractionTool';
import pako from 'pako';
import base64 from 'react-native-base64';
import { Alert } from 'react-native';

interface StudentCanvasSectionProps {
  solveType: 'EXAM' | 'HOMEWORK'
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPrevPage: () => void;
  savePaths: (pathData: string) => void;
  saveAnswer: (answer: string) => void;
  onSubmit: () => void;
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

const StudentCanvasSection = ({
  currentPage,
  totalPages,
  onNextPage,
  onPrevPage,
  savePaths,
  saveAnswer,
  onSubmit,
  solveType,
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

  const handleSavePaths = () => {
    const mergeSimilarPaths = (newPaths: PathData[]): PathData[] => {
      const mergedPaths: PathData[] = [];
      newPaths.forEach(saveCurrentPath => {
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
      return base64.encode(String.fromCharCode(...compressedData));
    };

    const encodedPaths = encodePathsToSolution(paths);
    savePaths(encodedPaths); // 병합된 paths를 상위로 전달
  };

  const confirmSavePaths = () => {
    Alert.alert(
      '필기 저장',
      '현재 필기를 저장하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { text: '저장', onPress: handleSavePaths },
      ],
      { cancelable: true }
    );
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
      <StudentInteractionTool
        solveType={solveType}
        currentPage={currentPage}
        totalPages={totalPages}
        onNextPage={onNextPage}
        onPrevPage={onPrevPage}
        setAnswer={saveAnswer}
        savePaths={confirmSavePaths}
        onSubmit={onSubmit}
      />
    </>
  );
};

export default StudentCanvasSection;
