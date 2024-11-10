import { useEffect, useState } from 'react';
import { Skia, useCanvasRef } from '@shopify/react-native-skia';
import CanvasDrawingTool from './CanvasDrawingTool';
import { Socket } from 'socket.io-client';
import base64 from 'react-native-base64';

import pako from 'pako';
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
  timestamps: number[]; // 개별 경로의 timestamp 배열
};

// 스택 데이터 구조
type ActionData = {
  type: 'draw' | 'erase';
  pathData: PathData;
};

// 상수
const ERASER_RADIUS = 10;
const MAX_STACK_SIZE = 5; // 최대 스택 크기

function TeacherCanvasSection({
  socket,
  currentPage,
  totalPages,
  onNextPage,
  onPrevPage,
}: TeacherCanvasSectionProps): React.JSX.Element {
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

  // pathGroups 데이터를 JSON으로 압축하고 Base64로 인코딩하여 전송
  useEffect(() => {
    const interval = setInterval(() => {
      const dataToSend = pathGroups.map(group =>
        group.map(pathData => ({
          ...pathData,
          path: pathData.path.toSVGString(),
        })),
      );

      // JSON 문자열로 변환 후 압축
      const compressedData = pako.deflate(JSON.stringify(dataToSend));

      // Uint8Array를 문자열로 변환 후 Base64 인코딩
      const base64EncodedData = base64.encode(
        String.fromCharCode(...compressedData),
      );

      // 소켓을 통해 서버로 전송
      socket.emit('left_to_right', base64EncodedData);
    }, 1000);

    return () => clearInterval(interval);
  }, [pathGroups, socket]);

  const togglePenOpacity = () => {
    setPenOpacity(prevOpacity => (prevOpacity === 1 ? 0.4 : 1)); // 형광펜 효과
  };

  const toggleEraserMode = () => {
    setIsErasing(!isErasing);

    if (!isErasing) {
      // 병합된 경로들을 분할
      setPathGroups(prevGroups => splitAllMergedPaths(prevGroups));
    } else {
      // 다시 병합 수행
      setPathGroups(prevGroups => mergeSimilarPaths(prevGroups));
    }
  };

  // 스타일이 같은 경로들을 병합하는 함수
  const mergeSimilarPaths = (groups: PathData[][]): PathData[][] => {
    const mergedGroups: PathData[][] = [];

    groups.forEach(group => {
      if (mergedGroups.length === 0) {
        mergedGroups.push([...group]);
        return;
      }

      const lastMergedGroup = mergedGroups[mergedGroups.length - 1];
      const lastPath = lastMergedGroup[0];

      // 마지막 병합 그룹과 스타일이 같으면 병합
      if (
        lastPath.color === group[0].color &&
        lastPath.strokeWidth === group[0].strokeWidth &&
        lastPath.opacity === group[0].opacity
      ) {
        const mergedPath = mergePaths([...lastMergedGroup, ...group]);

        if (mergedPath) {
          // 병합된 경로를 PathData로 만들어 추가
          const mergedPathData: PathData = {
            path: mergedPath,
            color: lastPath.color,
            strokeWidth: lastPath.strokeWidth,
            opacity: lastPath.opacity,
            timestamps: lastMergedGroup
              .flatMap(p => p.timestamps)
              .concat(group.flatMap(p => p.timestamps)), // timestamps 배열 병합
          };
          mergedGroups[mergedGroups.length - 1] = [mergedPathData];
        }
      } else {
        // 스타일이 다르면 새로운 그룹으로 추가
        mergedGroups.push([...group]);
      }
    });

    return mergedGroups;
  };

  // 병합된 경로들을 개별 경로로 분할하는 함수
  const splitAllMergedPaths = (groups: PathData[][]): PathData[][] => {
    return groups.map(group => {
      if (group.length === 1) {
        // 병합된 그룹을 개별 경로로 분리
        return splitMergedPath(group[0]);
      }
      return group; // 이미 분리된 그룹은 그대로 유지
    });
  };

  // 병합된 경로를 개별 경로로 분할하는 함수
  const splitMergedPath = (mergedPathData: PathData): PathData[] => {
    const svgString = mergedPathData.path.toSVGString();
    const pathSegments = svgString.split('M').slice(1); // 'M'을 기준으로 분할하여 세그먼트 생성

    return pathSegments
      .map((segment: string, index: number) => {
        const newPath = Skia.Path.MakeFromSVGString('M' + segment);
        if (!newPath) {
          console.warn('Invalid SVG segment:', segment);
          return null;
        }
        return {
          path: newPath,
          color: mergedPathData.color,
          strokeWidth: mergedPathData.strokeWidth,
          opacity: mergedPathData.opacity,
          timestamps: [mergedPathData.timestamps[index]], // 각 세그먼트의 timestamp 보존
        };
      })
      .filter(Boolean) as PathData[]; // null 필터링
  };

  // 경로 병합 함수
  const mergePaths = (pathsToMerge: PathData[]): PathData | null => {
    const mergedPathString = pathsToMerge
      .map(p => p.path.toSVGString())
      .join(' ');

    const mergedPath = Skia.Path.MakeFromSVGString(mergedPathString);

    if (!mergedPath) {
      console.warn('Failed to merge paths');
      return null;
    }

    return {
      path: mergedPath,
      color: pathsToMerge[0].color,
      strokeWidth: pathsToMerge[0].strokeWidth,
      opacity: pathsToMerge[0].opacity,
      timestamps: pathsToMerge.flatMap(p => p.timestamps), // 각 경로의 timestamp를 배열로 병합
    };
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
        const mergedPathData = mergePaths(lastGroup);

        if (mergedPathData) {
          return [...prevGroups.slice(0, -1), [mergedPathData]];
        }
      }

      // 스타일이 다르면 새 그룹 시작
      return [...prevGroups, [newPath]];
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
              addToUndoStack({ type: 'erase', pathData });
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
        timestamps: [Date.now()], // 경로 완료 시점 타임스탬프
      };
      addPathToGroup(newPathData);
      addToUndoStack({ type: 'draw', pathData: newPathData });
      setCurrentPath(null);
      setRedoStack([]);
    }
  };

  const handleSetPenColor = (color: string) => {
    if (isErasing) {
      setIsErasing(false);
      setPathGroups(prevGroups =>
        mergeSimilarPaths(prevGroups)
      ); // 병합 수행
    }
    setPenColor(color);
  };

  const handleSetPenSize = (size: number) => {
    if (isErasing) {
      setIsErasing(false);
      setPathGroups(prevGroups =>
        mergeSimilarPaths(prevGroups)
      ); // 병합 수행
    }
    setPenSize(size);
  };

  return (
    <>
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
}

export default TeacherCanvasSection;
