import { useEffect, useState } from 'react';
import { Canvas, Path, Skia, useCanvasRef } from '@shopify/react-native-skia';
import pako from 'pako';
import { Dimensions, StyleSheet, View } from 'react-native';
import base64 from 'react-native-base64';

interface StudentCanvasSectionProps {
  receivedMessage: string | null;
  isTeacherScreenOn: boolean;
}

type PathData = {
  path: any;
  color: string;
  strokeWidth: number;
  opacity: number;
};

// 학생 캔버스 컴포넌트
function StudentRealTimeCanvasRefSection({
  receivedMessage,
  isTeacherScreenOn,
}: StudentCanvasSectionProps): React.JSX.Element {
  const canvasRef = useCanvasRef();
  const [paths, setPaths] = useState<PathData[]>([]);

  const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

  // 기기 비율 계산을 위한 상태 변수
  const [widthRatio, setWidthRatio] = useState(1);
  const [heightRatio, setHeightRatio] = useState(1);

  useEffect(() => {
    if (receivedMessage) {
      const messageObject = JSON.parse(receivedMessage);
      if (
        messageObject.drawingData &&
        messageObject.width &&
        messageObject.height
      ) {
        const newWidthRatio = parseFloat((deviceWidth / messageObject.width).toFixed(6));
        const newHeightRatio = parseFloat((deviceHeight / messageObject.height).toFixed(6));

        setWidthRatio(newWidthRatio);
        setHeightRatio(newHeightRatio);

        handleSync(messageObject.drawingData);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receivedMessage, deviceWidth, deviceHeight]);

  const handleSync = (base64EncodedData: string) => {
    try {
      // Base64 디코딩 및 압축 해제
      const binaryString = base64.decode(base64EncodedData);
      const compressedData = Uint8Array.from(
        binaryString.split('').map(char => char.charCodeAt(0)),
      );
      const decompressedData = JSON.parse(
        pako.inflate(compressedData, { to: 'string' }),
      );

      // 경로를 Skia Path로 변환
      const parsedPaths = decompressedData
        .map((pathData: any) => {
          const pathString = pathData.path;
          const path = Skia.Path.MakeFromSVGString(pathString);
          return path ? { ...pathData, path } : null;
        })
        .filter(Boolean);

      // 데이터 교체
      setPaths(mergeSimilarPaths(parsedPaths));
    } catch (error) {
      console.error('Failed to decompress or parse data:', error);
    }
  };

  const mergeSimilarPaths = (newPaths: PathData[]): PathData[] => {
    const mergedPaths: PathData[] = [];

    newPaths.forEach(currentPath => {
      const lastMergedPath = mergedPaths[mergedPaths.length - 1];

      if (
        lastMergedPath &&
        lastMergedPath.color === currentPath.color &&
        lastMergedPath.strokeWidth === currentPath.strokeWidth &&
        lastMergedPath.opacity === currentPath.opacity
      ) {
        const mergedPathString =
          lastMergedPath.path.toSVGString() +
          ' ' +
          currentPath.path.toSVGString();
        const mergedPath = Skia.Path.MakeFromSVGString(mergedPathString);

        if (mergedPath) {
          lastMergedPath.path = mergedPath;
        }
      } else {
        mergedPaths.push(currentPath);
      }
    });

    return mergedPaths;
  };

  return (
    <View style={styles.canvasLayout}>
      {isTeacherScreenOn &&
        <Canvas
          style={[
            styles.canvas,
            {
              transform: [
                { translateX: (deviceWidth * (1 - 1 / widthRatio)) / 2 },
                { translateY: (deviceHeight * (1 - 1 / heightRatio)) / 2 },
                { scaleX: widthRatio / 1 },
                { scaleY: heightRatio / 1 },
              ],
            },
          ]}
          ref={canvasRef}>
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
      }
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
  placeholder: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
