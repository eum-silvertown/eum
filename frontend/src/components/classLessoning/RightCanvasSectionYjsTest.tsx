import { useEffect, useState } from 'react';
import { Skia, useCanvasRef } from '@shopify/react-native-skia';
import CanvasDrawingTool from './CanvasDrawingTool';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

const doc = new Y.Doc();
const provider = new WebsocketProvider('ws://localhost:1234', 'canvas-test-room', doc);

type PathData = {
    path: any;
    color: string;
    strokeWidth: number;
    opacity: number;
};

function RightCanvasSectionYjsTest(): React.JSX.Element {
    const canvasRef = useCanvasRef();
    const [paths, setPaths] = useState<PathData[]>([]);
    const [currentPath, setCurrentPath] = useState<any | null>(null);
    const [penColor, setPenColor] = useState('#000000');
    const [penSize, setPenSize] = useState(2);
    const [penOpacity, setPenOpacity] = useState(1);
    const yPaths = doc.getArray<PathData>('paths');
    const undoStack = doc.getArray<PathData>('undoStack'); // Undo 히스토리 관리
    const redoStack = doc.getArray<PathData>('redoStack'); // Redo 히스토리 관리

    useEffect(() => {
        // 연결 상태 디버깅을 위한 이벤트 핸들러
        provider.on('status', (event: { status: string }) => {
            console.log(`WebSocket 상태: ${event.status}`); // 연결 상태 (connected/disconnected)
        });

        provider.on('sync', (isSynced: boolean) => {
            console.log(`동기화 상태: ${isSynced ? '완료' : '미완료'}`); // 데이터 동기화 상태
        });

        provider.on('connection-close', () => {
            console.log('WebSocket 연결이 종료되었습니다.');
        });

        provider.on('connection-error', (error: Error) => {
            console.error('WebSocket 연결 오류:', error.message);
        });

        return () => {
            provider.destroy(); // 컴포넌트 언마운트 시 WebSocket 해제
        };
    }, []);

    useEffect(() => {
        // 연결 상태 확인
        provider.on('status', (event: { status: string }) => {
            console.log(`WebSocket Provider 상태: ${event.status}`);
        });

        // Yjs 배열에 대한 상태 관찰
        yPaths.observe(() => {
            setPaths(yPaths.toArray());
        });

        return () => {
            provider.destroy(); // 컴포넌트 언마운트 시 WebSocket 해제
        };
    }, [yPaths]);

    const handleTouchStart = (event: any) => {
        const { locationX, locationY } = event.nativeEvent;
        const newPath = Skia.Path.Make();
        newPath.moveTo(locationX, locationY);
        setCurrentPath(newPath);
    };

    const handleTouchMove = (event: any) => {
        const { locationX, locationY } = event.nativeEvent;
        if (currentPath) {
            currentPath.lineTo(locationX, locationY);
            canvasRef.current?.redraw();
        }
    };

    const handleTouchEnd = () => {
        if (currentPath) {
            const newPathData = {
                path: currentPath,
                color: penColor,
                strokeWidth: penSize,
                opacity: penOpacity,
            };

            // 현재 경로 Yjs에 추가 및 Undo 스택에 저장
            yPaths.push([newPathData]);
            undoStack.push([newPathData]);
            redoStack.delete(0, redoStack.length); // 새 작업 시 Redo 스택 초기화
            setCurrentPath(null);
        }
    };

    const undo = () => {
        if (undoStack.length > 0) {
            const lastAction = undoStack.get(undoStack.length - 1);
            yPaths.delete(yPaths.length - 1, 1); // Yjs 경로 삭제
            undoStack.delete(undoStack.length - 1, 1);
            redoStack.push([lastAction]); // Redo 스택에 추가
        }
    };

    const redo = () => {
        if (redoStack.length > 0) {
            const lastRedoAction = redoStack.get(redoStack.length - 1);
            yPaths.push([lastRedoAction]); // Yjs에 다시 추가
            redoStack.delete(redoStack.length - 1, 1);
            undoStack.push([lastRedoAction]); // Undo 스택에 추가
        }
    };

    const setPenColorHandler = (color: string) => setPenColor(color);
    const setPenSizeHandler = (size: number) => setPenSize(size);

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
            setPenColor={setPenColorHandler}
            setPenSize={setPenSizeHandler}
            undo={undo}
            redo={redo}
        />
    );
}

export default RightCanvasSectionYjsTest;
