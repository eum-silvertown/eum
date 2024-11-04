import {useEffect, useState} from 'react';
import {Canvas, Path, Skia, useCanvasRef} from '@shopify/react-native-skia';
import {Socket} from 'socket.io-client';
import pako from 'pako';
import {StyleSheet, View} from 'react-native';

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

// 병합 함수 정의
const mergePaths = (pathsToMerge: PathData[]) => {
  const mergedPathString = pathsToMerge
    .map(p => p.path.toSVGString())
    .join(' ');
  const latestTimestamp = pathsToMerge[pathsToMerge.length - 1].timestamp;

  return {
    path: Skia.Path.MakeFromSVGString(mergedPathString),
    color: pathsToMerge[0].color,
    strokeWidth: pathsToMerge[0].strokeWidth,
    opacity: pathsToMerge[0].opacity,
    timestamp: latestTimestamp,
  };
};

// 오른쪽 캔버스 컴포넌트
function RightCanvasRefSection({
  socket,
}: RightCanvasSectionProps): React.JSX.Element {
  const canvasRef = useCanvasRef();
  const [paths, setPaths] = useState<PathData[]>([]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('오른쪽 캔버스 서버에 연결됨:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('서버 연결이 해제되었습니다.');
    });

    socket.on('left_to_right_move', (compressedData: Uint8Array) => {
      try {
        const decompressedData = JSON.parse(
          pako.inflate(compressedData, {to: 'string'}),
        );

        const receivedPath = Skia.Path.MakeFromSVGString(decompressedData.path);

        if (receivedPath) {
          const newPathData = {
            path: receivedPath,
            color: decompressedData.color,
            strokeWidth: decompressedData.strokeWidth,
            opacity: decompressedData.opacity,
            timestamp: Date.now(),
          };

          setPaths(prevPaths => {
            const lastPath = prevPaths[prevPaths.length - 1];
            if (
              lastPath &&
              lastPath.color === newPathData.color &&
              lastPath.strokeWidth === newPathData.strokeWidth &&
              lastPath.opacity === newPathData.opacity
            ) {
              const mergedPath = mergePaths([lastPath, newPathData]);
              return [...prevPaths.slice(0, -1), mergedPath];
            } else {
              return [...prevPaths, newPathData];
            }
          });
        }
      } catch (error) {
        console.error('Failed to decompress data:', error);
      }
    });

    return () => {
      socket.off('left_to_right_move');
    };
  }, [socket]);

  return (
    <View style={styles.canvasLayout}>
      <View style={styles.canvasContainer}>
        <Canvas style={styles.canvas} ref={canvasRef}>
          {paths.map(({path, color, strokeWidth, opacity}, index) => (
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
  canvas: {flex: 1},
});
