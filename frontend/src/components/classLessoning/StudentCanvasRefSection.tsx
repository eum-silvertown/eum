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
  timestamps: number[]; // 개별 경로의 timestamp 배열
};

function StudentCanvasRefSection({
  socket,
}: StudentCanvasSectionProps): React.JSX.Element {
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
    socket.on('left_to_right', (base64EncodedData: string) => {
      try {
        // 1. Base64 디코딩 후 Uint8Array로 변환
        const binaryString = base64.decode(base64EncodedData);
        const compressedData = Uint8Array.from(
          binaryString.split('').map(char => char.charCodeAt(0)),
        );

        // 2. 압축 해제
        const decompressedData = JSON.parse(
          pako.inflate(compressedData, { to: 'string' }),
        );

        // 3. SVG 경로 데이터를 Skia Path 객체로 변환
        const parsedPaths = decompressedData.map((group: any) =>
          group.map((pathData: any) => ({
            ...pathData,
            path: Skia.Path.MakeFromSVGString(pathData.path),
            timestamps: pathData.timestamps || [], // timestamps가 배열인지 확인
          })),
        );

        setPathGroups(parsedPaths); // 상태 업데이트
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
