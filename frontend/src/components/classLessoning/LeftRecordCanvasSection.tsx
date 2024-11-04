import {useCallback, useEffect, useRef, useState} from 'react';
import {Skia, useCanvasRef} from '@shopify/react-native-skia';
import CanvasDrawingTool from './CanvasDrawingTool';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LeftCanvasSectionProps {
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

// 상수 관리
const ERASER_RADIUS = 10; // 지우개 범위 크기
const MAX_STACK_SIZE = 10; // 최대 스택 크기
const MAX_MEMORY_PATHS = 5; // 메모리에 유지할 최대 경로 수
const STORAGE_KEY = 'drawing_paths';

// 왼쪽 캔버스 컴포넌트
function LeftRecordCanvasSection({}: LeftCanvasSectionProps): React.JSX.Element {
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

  const deletedPaths = useRef<number[]>([]); // 삭제된 경로 ID 추적

  // 로컬 저장소에 paths 데이터 저장
  const savePathsToLocalStorage = async (pathsData: PathData[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pathsData));
      console.log('Data saved to local storage:', pathsData); // 저장 시 로그 출력
    } catch (error) {
      console.error('Failed to save paths to local storage:', error);
    }
  };

  // 로컬 저장소 데이터 초기화
  const clearLocalStorage = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY); // 저장된 경로 데이터 삭제
      console.log('Local storage cleared'); // 삭제 로그
    } catch (error) {
      console.error('Failed to clear local storage:', error);
    }
  };

  useEffect(() => {
    const initializePage = async () => {
      await clearLocalStorage(); // 로컬 저장소 초기화
      // 필요한 다른 초기화 작업이 있다면 추가로 여기서 호출할 수 있습니다.
    };
    initializePage();
  }, []); // 빈 배열을 사용하여 페이지 로드 시 한 번만 실행

  // 로컬 저장소에서 paths 데이터 불러오기
  const loadPathsFromLocalStorage = async (): Promise<PathData[]> => {
    try {
      const storedPaths = await AsyncStorage.getItem(STORAGE_KEY);
      const parsedPaths = storedPaths ? JSON.parse(storedPaths) : [];
      console.log('Data loaded from local storage:', parsedPaths); // 불러오기 시 로그 출력
      return parsedPaths;
    } catch (error) {
      console.error('Failed to load paths from local storage:', error);
      return [];
    }
  };

  // 오래된 데이터를 로컬 저장소로 이동하고 paths 배열을 최신 5개로 유지
  const offloadOldPaths = async (newPath: PathData) => {
    setPaths(prevPaths => {
      const updatedPaths = [...prevPaths, newPath];
      if (updatedPaths.length <= MAX_MEMORY_PATHS) {
        return updatedPaths;
      }

      // 초과된 데이터를 로컬로 오프로드
      const pathsToOffload = updatedPaths.slice(
        0,
        updatedPaths.length - MAX_MEMORY_PATHS,
      );
      savePathsToLocalStorage(pathsToOffload);

      // 최신 5개 경로만 유지
      const remainingPaths = updatedPaths.slice(
        updatedPaths.length - MAX_MEMORY_PATHS,
      );
      console.log('Remaining paths in memory:', remainingPaths);
      return remainingPaths;
    });
  };

  useEffect(() => {
    const initializePaths = async () => {
      const loadedPaths = await loadPathsFromLocalStorage();
      setPaths(loadedPaths.slice(-MAX_MEMORY_PATHS)); // 로드한 데이터의 최신 5개만 로드
    };
    initializePaths();
  }, []);

  const handleNewPath = (newPath: PathData) => {
    offloadOldPaths(newPath); // 새 경로 추가 시 메모리 제한을 초과하면 오프로드
  };

  // paths 배열 변경 시 로그 출력
  useEffect(() => {
    console.log('Paths updated:', paths);
  }, [paths]);

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
          setUndoStack(prevUndoStack => [
            ...prevUndoStack,
            {type: 'erase', pathData},
          ]);
          deletedPaths.current.push(pathData.timestamp); // 삭제된 경로 ID 기록
        }
        return !isInEraseArea;
      }),
    );
    setRedoStack([]);
  };
  // 삭제된 경로를 반영하여 로컬 저장소 동기화
  const syncDeletedPathsWithLocalStorage = useCallback(async () => {
    const localPaths = await loadPathsFromLocalStorage();
    const filteredPaths = localPaths.filter(
      path => !deletedPaths.current.includes(path.timestamp),
    );
    await savePathsToLocalStorage(filteredPaths);
    deletedPaths.current = []; // 삭제된 경로 목록 초기화
  }, []);

  useEffect(() => {
    const interval = setInterval(syncDeletedPathsWithLocalStorage, 5000); // 5초마다 동기화
    return () => clearInterval(interval);
  }, [syncDeletedPathsWithLocalStorage]);

  const addToUndoStack = (action: ActionData) => {
    setUndoStack(prevUndoStack => {
      const newUndoStack = [...prevUndoStack, action];
      // 스택이 최대 크기를 초과하면 앞의 요소를 하나 제거
      if (newUndoStack.length > MAX_STACK_SIZE) {
        newUndoStack.shift();
      }
      return newUndoStack;
    });
  };
  const addToRedoStack = (action: ActionData) => {
    setRedoStack(prevRedoStack => {
      const newRedoStack = [...prevRedoStack, action];
      // 스택이 최대 크기를 초과하면 첫 번째 요소 제거
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
    console.log('locationX:', locationX, 'locationY:', locationY);

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
      const newPathData = {
        path: currentPath,
        color: penColor,
        strokeWidth: penSize,
        opacity: penOpacity,
        timestamp: Date.now(), // timestamp 자체를 고유 ID로 사용
      };
      addToUndoStack({type: 'draw', pathData: newPathData});
      handleNewPath(newPathData); // 새로운 경로 추가 및 메모리 관리
      setCurrentPath(null);
      setRedoStack([]); // 새로운 경로가 추가되면 redo 스택 초기화
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
      undoStack={undoStack.length}
      redoStack={redoStack.length}
      toggleEraserMode={toggleEraserMode}
      isErasing={isErasing}
      eraserPosition={eraserPosition}
    />
  );
}

export default LeftRecordCanvasSection;
