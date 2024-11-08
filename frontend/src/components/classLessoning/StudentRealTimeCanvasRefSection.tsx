import { useEffect, useState } from 'react';
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
function StudentCanvasRefSection({
  socket,
}: StudentCanvasSectionProps): React.JSX.Element {
  const canvasRef = useCanvasRef();
  const [paths, setPaths] = useState<PathData[]>([]); // PathData[]로 변경하여 일관성 유지

  useEffect(() => {
    socket.on('connect', () => {
      console.log('학생 캔버스 서버에 연결됨:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('서버 연결이 해제되었습니다.');
    });

    // 전체 데이터를 수신하여 paths 갱신
    socket.on('sync', (base64EncodedData: string) => {
      try {
        const binaryString = base64.decode(base64EncodedData);
        const compressedData = Uint8Array.from(
          binaryString.split('').map(char => char.charCodeAt(0)),
        );
        const decompressedData = JSON.parse(
          pako.inflate(compressedData, { to: 'string' }),
        );

        const parsedPaths = decompressedData.map((pathData: any) => ({
          ...pathData,
          path: Skia.Path.MakeFromSVGString(pathData.path),
        }));

        setPaths(parsedPaths); // 전체 데이터를 paths로 설정하여 교체
        console.log('[Socket Sync] 전체 데이터 수신 및 상태 갱신:', parsedPaths);
      } catch (error) {
        console.error('Failed to decompress or parse sync data:', error);
      }
    });

    // 실시간 경로 데이터를 수신하여 paths에 추가
    socket.on('sync_move', (base64EncodedData: string) => {
      try {
        const binaryString = base64.decode(base64EncodedData);
        const compressedData = Uint8Array.from(
          binaryString.split('').map(char => char.charCodeAt(0)),
        );
        const newPathData = JSON.parse(
          pako.inflate(compressedData, { to: 'string' }),
        );

        const newPath = {
          ...newPathData,
          path: Skia.Path.MakeFromSVGString(newPathData.path),
        };

        setPaths(prevPaths => [...prevPaths, newPath]); // 새 경로를 기존 paths 배열에 추가
        console.log('[Socket Sync Move] 실시간 데이터 수신 및 추가:', newPathData);
      } catch (error) {
        console.error('Failed to decompress or parse sync_move data:', error);
      }
    });

    return () => {
      socket.off('sync');
      socket.off('sync_move');
    };
  }, [socket]);

  return (
    <View style={styles.canvasLayout}>
      <View style={styles.canvasContainer}>
        <Canvas style={styles.canvas} ref={canvasRef}>
          {paths.map(({ path, color, strokeWidth, opacity }, index) => (
            <Path
              key={index}
              path={path}
              color={Skia.Color(color)}
              style="stroke"
              strokeWidth={strokeWidth}
              strokeCap="round"
              strokeJoin="round"
              opacity={opacity}
            />
          ))}
        </Canvas>
      </View>
    </View>
  );
}

export default StudentCanvasRefSection;

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
