import { useEffect, useState } from 'react';
import { Canvas, Path, Skia, useCanvasRef } from '@shopify/react-native-skia';
import { Socket } from 'socket.io-client';
import pako from 'pako';
import { StyleSheet, View } from 'react-native';

interface RightCanvasSectionProps {
  socket: Socket;
}

// Path 데이터 구조
type PathData = {
  path: any;
  color: string;
  strokeWidth: number;
  opacity: number;
  timestamp: number; // 단일 타임스탬프
};

// 오른쪽 캔버스 컴포넌트
function RightCanvasRefSection({
  socket,
}: RightCanvasSectionProps): React.JSX.Element {
  const canvasRef = useCanvasRef();
  const [pathGroups, setPathGroups] = useState<PathData[][]>([]);
  console.log(pathGroups);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('오른쪽 캔버스 서버에 연결됨:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('서버 연결이 해제되었습니다.');
    });

    // pathGroups_data 이벤트를 통해 2초마다 전체 데이터를 수신하고 상태에 저장
    socket.on('left_to_right', (compressedData: Uint8Array) => {
      try {
        const decompressedData = JSON.parse(
          pako.inflate(compressedData, { to: 'string' }),
        );
        console.log('압축 해제 데이터', decompressedData);

        const parsedPaths = decompressedData.map((group: any) =>
          group.map((pathData: any) => ({
            ...pathData,
            path: Skia.Path.MakeFromSVGString(pathData.path.toString()),
          })),
        );

        setPathGroups(parsedPaths);
      } catch (error) {
        console.error('Failed to decompress or parse data:', error);
      }

    });

    return () => {
      socket.off('left_to_right');
    };
  }, [socket]);

  return (
    <View style={styles.canvasLayout}>
      <View style={styles.canvasContainer}>
        <Canvas style={styles.canvas} ref={canvasRef}>
          {pathGroups
            .flat()
            .map(({ path, color, strokeWidth, opacity }, index) => (
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

export default RightCanvasRefSection;
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
