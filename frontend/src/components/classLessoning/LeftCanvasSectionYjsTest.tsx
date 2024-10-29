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

function LeftCanvasSectionYjsTest(): React.JSX.Element {
    const canvasRef = useCanvasRef();
    const [paths, setPaths] = useState<PathData[]>([]);
    const [currentPath, setCurrentPath] = useState<any | null>(null);
    const [penColor, setPenColor] = useState('#000000');
    const [penSize, setPenSize] = useState(2);
    const [penOpacity, setPenOpacity] = useState(1);
    const yPaths = doc.getArray<PathData>('paths');

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
        // Yjs에서 paths 배열이 업데이트될 때마다 실행
        yPaths.observe(() => {
            setPaths(yPaths.toArray());
        });
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

            // Yjs Array에 새로운 경로 추가
            yPaths.push([newPathData]);
            setCurrentPath(null);
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
        />
    );
}

export default LeftCanvasSectionYjsTest;
