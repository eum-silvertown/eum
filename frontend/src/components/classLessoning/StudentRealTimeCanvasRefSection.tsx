import { useEffect, useRef, useState } from 'react';
import { Canvas, Path, Skia, useCanvasRef } from '@shopify/react-native-skia';
import { Socket } from 'socket.io-client';
import pako from 'pako';
import { StyleSheet, View } from 'react-native';
import base64 from 'react-native-base64';

interface StudentCanvasSectionProps {
  socket: Socket;
}

type PathData = {
  path: any;
  color: string;
  strokeWidth: number;
  opacity: number;
};

// 학생 캔버스 컴포넌트
function StudentRealTimeCanvasRefSection({
  socket,
}: StudentCanvasSectionProps): React.JSX.Element {
  const canvasRef = useCanvasRef();
  const pathsRef = useRef<PathData[]>([]); // paths 상태를 useRef로 관리
  const [, forceRender] = useState(0);
  console.log('잔여데이터', pathsRef, '잔여');

  const updatePaths = (newPaths: PathData[]) => {
    pathsRef.current = newPaths;
    forceRender((prev) => prev + 1); // 렌더링 강제 업데이트
  };

  useEffect(() => {
    const handleSync = (base64EncodedData: string) => {
      try {
        const binaryString = base64.decode(base64EncodedData);
        const compressedData = Uint8Array.from(binaryString.split('').map(char => char.charCodeAt(0)));
        const decompressedData = JSON.parse(pako.inflate(compressedData, { to: 'string' }));

        const parsedPaths = decompressedData
          .map((pathData: any) => {
            const path = Skia.Path.MakeFromSVGString(pathData.path);
            return path ? { ...pathData, path } : null;
          })
          .filter(Boolean);

        updatePaths(parsedPaths); // 전체 데이터를 pathsRef에 설정하여 교체
      } catch (error) {
        console.error('Failed to decompress or parse left_to_right data:', error);
      }
    };

    const handleSyncMove = (base64EncodedData: string) => {
      try {
        const binaryString = base64.decode(base64EncodedData);
        const compressedData = Uint8Array.from(binaryString.split('').map(char => char.charCodeAt(0)));
        const newPathData = JSON.parse(pako.inflate(compressedData, { to: 'string' }));
        const newPath = Skia.Path.MakeFromSVGString(newPathData.path);

        if (newPath) {
          // 새로운 데이터와 기존 데이터 병합 후 pathsRef 업데이트
          const updatedPaths = mergeSimilarPaths([...pathsRef.current, { ...newPathData, path: newPath }]);
          pathsRef.current = updatedPaths;
          forceRender((prev) => prev + 1); // 강제 렌더링
        }
      } catch (error) {
        console.error('Failed to decompress or parse left_to_right_move data:', error);
      }
    };

    const mergeSimilarPaths = (paths: PathData[]): PathData[] => {
      const mergedPaths: PathData[] = [];

      paths.forEach(currentPath => {
        const lastMergedPath = mergedPaths[mergedPaths.length - 1];

        // 마지막 병합된 경로와 스타일이 같으면 병합
        if (
          lastMergedPath &&
          lastMergedPath.color === currentPath.color &&
          lastMergedPath.strokeWidth === currentPath.strokeWidth &&
          lastMergedPath.opacity === currentPath.opacity
        ) {
          const mergedPathString = lastMergedPath.path.toSVGString() + ' ' + currentPath.path.toSVGString();
          const mergedPath = Skia.Path.MakeFromSVGString(mergedPathString);

          if (mergedPath) {
            lastMergedPath.path = mergedPath; // 병합된 경로 업데이트
          }
        } else {
          // 스타일이 다르면 새 경로로 추가
          mergedPaths.push(currentPath);
        }
      });

      return mergedPaths;
    };


    socket.on('connect', () => {
      console.log('학생 캔버스 서버에 연결됨:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('서버 연결이 해제되었습니다.');
    });

    // 이벤트 리스너 등록
    socket.on('left_to_right', handleSync);
    socket.on('left_to_right_move', handleSyncMove);

    return () => {
      // 이벤트 리스너 정리
      socket.off('connect');
      socket.off('disconnect');
      socket.off('left_to_right', handleSync);
      socket.off('left_to_right_move', handleSyncMove);
    };
  }, [socket]);

  return (
    <View style={styles.canvasLayout}>
      <Canvas style={styles.canvas} ref={canvasRef}>
        {pathsRef.current.map(({ path, color, strokeWidth, opacity }, index) => (
          <Path key={index} path={path} color={Skia.Color(color)} style="stroke" strokeWidth={strokeWidth} strokeCap="round" strokeJoin="round" opacity={opacity} />
        ))}
      </Canvas>
    </View>
  );
}

export default StudentRealTimeCanvasRefSection;

const styles = StyleSheet.create({
  canvasLayout: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  canvasContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  canvas: { flex: 1 },
});
