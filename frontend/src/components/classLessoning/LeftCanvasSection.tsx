import { useEffect, useState } from 'react';
import {
    Skia,
    useCanvasRef,
} from '@shopify/react-native-skia';
import CanvasDrawingTool from './CanvasDrawingTool';
import { Socket } from 'socket.io-client';

interface LeftCanvasSectionProps {
    socket: Socket;
}

// 지우개 범위 상수
const ERASER_RADIUS = 10;

// 왼쪽 캔버스 컴포넌트
function LeftCanvasSection({ socket }: LeftCanvasSectionProps): React.JSX.Element {
    const canvasRef = useCanvasRef();
    const [paths, setPaths] = useState<
        { path: any; color: string; strokeWidth: number; opacity: number }[]
    >([]);
    const [currentPath, setCurrentPath] = useState<any | null>(null);
    const [penColor, setPenColor] = useState('#000000');
    const [penSize, setPenSize] = useState(2);
    const [penOpacity, setPenOpacity] = useState(1);
    const [undoStack, setUndoStack] = useState<any[]>([]);
    const [, setRedoStack] = useState<any[]>([]);
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
            prevPaths.filter(({ path }) => {
                const bounds = path.getBounds();
                const dx = Math.max(bounds.x - x, x - (bounds.x + bounds.width), 0);
                const dy = Math.max(bounds.y - y, y - (bounds.y + bounds.height), 0);
                const isInEraseArea = dx * dx + dy * dy < ERASER_RADIUS * ERASER_RADIUS;

                if (isInEraseArea) {
                    setUndoStack(prev => [...prev, path]); // 삭제된 path를 undo 스택에 추가
                }
                return !isInEraseArea;
            }),
        );
        // TODO : 예외처리 필요
        setRedoStack([]); // 지우기 작업 후 redo 스택 초기화
    };

    const undo = () => {
        if (paths.length > 0) {
            const lastPath = paths[paths.length - 1];
            setUndoStack([...undoStack, lastPath]);
            setPaths(paths.slice(0, -1));
        }
    };

    const redo = () => {
        if (undoStack.length > 0) {
            const pathToRedo = undoStack[undoStack.length - 1];
            setPaths([...paths, pathToRedo]);
            setUndoStack(undoStack.slice(0, -1));
        }
    };

    useEffect(() => {
        socket.on('connect', () => {
            console.log('왼쪽 캔버스 서버에 연결됨:', socket.id);
        });
        // 연결이 끊어졌을 때
        socket.on('disconnect', () => {
            console.log('서버 연결이 해제되었습니다.');
        });
        // 오른쪽 캔버스에서 전송된 그리기 데이터 수신
        console.log('Setting up right_to_left listener');
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
                    },
                ]);
            }
        });
        return () => {
            socket.off('right_to_left');
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
            socket.emit('left_to_right', {
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

export default LeftCanvasSection;
