import { useEffect, useState } from 'react';
import {
    Skia,
    useCanvasRef,
} from '@shopify/react-native-skia';
import { Socket } from 'socket.io-client';
import CanvasDrawingTool from './CanvasDrawingTool';

interface RightCanvasSectionProps {
    socket: Socket;
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

// 지우개 범위 상수
const ERASER_RADIUS = 10;

// 오른쪽 캔버스 컴포넌트
function RightCanvasSection({ socket }: RightCanvasSectionProps): React.JSX.Element {
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
        setPenOpacity(prevOpacity => (prevOpacity === 1 ? 0.4 : 1)); // 형광펜 효과
        console.log('변경완료');
    };

    const toggleEraserMode = () => setIsErasing(!isErasing); // 지우개 모드 토글

    const erasePath = (x: number, y: number) => {
        setPaths(prevPaths =>
            prevPaths.filter((pathData) => {
                const bounds = pathData.path.getBounds();
                const dx = Math.max(bounds.x - x, x - (bounds.x + bounds.width), 0);
                const dy = Math.max(bounds.y - y, y - (bounds.y + bounds.height), 0);
                const isInEraseArea = dx * dx + dy * dy < ERASER_RADIUS * ERASER_RADIUS;

                if (isInEraseArea) {
                    setUndoStack(prevUndoStack => [
                        ...prevUndoStack,
                        { type: 'erase', pathData },
                    ]);
                }
                return !isInEraseArea;
            })
        );
        setRedoStack([]); // 새로운 작업 발생 시 redo 스택 초기화
    };

    const undo = () => {
        if (undoStack.length === 0) { return; }

        const lastAction = undoStack[undoStack.length - 1];
        setUndoStack(undoStack.slice(0, -1));

        if (lastAction.type === 'draw') {
            setPaths(paths.slice(0, -1)); // 마지막 경로 제거
            setRedoStack([...redoStack, lastAction]); // redo 스택에 추가
        } else if (lastAction.type === 'erase') {
            // 지운 경로 복구
            setPaths([...paths, lastAction.pathData]);
            setRedoStack([...redoStack, lastAction]);
        }
    };

    const redo = () => {
        if (redoStack.length === 0) { return; }

        const lastRedoAction = redoStack[redoStack.length - 1];
        setRedoStack(redoStack.slice(0, -1));

        if (lastRedoAction.type === 'draw') {
            setPaths([...paths, lastRedoAction.pathData]); // 경로 다시 추가
            setUndoStack([...undoStack, lastRedoAction]);
        } else if (lastRedoAction.type === 'erase') {
            // 지우기 작업 반복
            setPaths(paths.filter(pathData => pathData !== lastRedoAction.pathData));
            setUndoStack([...undoStack, lastRedoAction]);
        }
    };

    useEffect(() => {
        socket.on('connect', () => {
            console.log('오른쪽 캔버스 서버에 연결됨:', socket.id);
        });
        // 연결이 끊어졌을 때
        socket.on('disconnect', () => {
            console.log('서버 연결이 해제되었습니다.');
        });
        // 왼쪽 캔버스에서 전송된 그리기 데이터 수신
        console.log('Setting up left_to_right listener');
        socket.on('left_to_right', data => {
            console.log('Left to Right Path received:', data);

            const receivedPath = Skia.Path.MakeFromSVGString(data.pathString);
            if (receivedPath) {
                setPaths(prevPaths => [
                    ...prevPaths,
                    {
                        path: receivedPath,
                        color: data.color,
                        strokeWidth: data.strokeWidth,
                        opacity: data.opacity,
                    },
                ]);
            }
        });
        return () => {
            socket.off('left_to_right');
        };
    }, [socket]);

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
            const pathString = currentPath.toSVGString();
            const newPathData = {
                path: currentPath,
                color: penColor,
                strokeWidth: penSize,
                opacity: penOpacity,
            };

            setUndoStack(prevUndoStack => [
                ...prevUndoStack,
                { type: 'draw', pathData: newPathData },
            ]);

            socket.emit('right_to_left', {
                pathString,
                color: penColor,
                strokeWidth: penSize,
                opacity: penOpacity,
            });
            setPaths(prevPaths => [...prevPaths, newPathData]);
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
            toggleEraserMode={toggleEraserMode}
            isErasing={isErasing}
            eraserPosition={eraserPosition}
        />
    );
}

export default RightCanvasSection;
