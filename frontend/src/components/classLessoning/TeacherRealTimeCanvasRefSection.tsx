import {useEffect, useState} from 'react';
import {Canvas, Path, Skia, useCanvasRef} from '@shopify/react-native-skia';
import pako from 'pako';
import {StyleSheet, View} from 'react-native';
import base64 from 'react-native-base64';

interface StudentCanvasSectionProps {
  receivedMessage: string | null;
}

type PathData = {
  path: any;
  color: string;
  strokeWidth: number;
  opacity: number;
};

// 학생 캔버스 컴포넌트
function TeacherRealTimeCanvasRefSection({
  receivedMessage,
}: StudentCanvasSectionProps): React.JSX.Element {
  const canvasRef = useCanvasRef();
  const [paths, setPaths] = useState<PathData[]>([]);
  console.log('학생 캔버스 받을 준비 완료');

  useEffect(() => {
    if (receivedMessage) {
      const messageObject = JSON.parse(receivedMessage);
      if (messageObject.drawingData) {
        handleSync(messageObject.drawingData);
        handleSyncMove(messageObject.drawingData);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receivedMessage]);

  const handleSync = (base64EncodedData: string) => {
    try {
      const binaryString = base64.decode(base64EncodedData);
      const compressedData = Uint8Array.from(
        binaryString.split('').map(char => char.charCodeAt(0)),
      );
      const decompressedData = JSON.parse(
        pako.inflate(compressedData, {to: 'string'}),
      );

      const parsedPaths = decompressedData
        .map((pathData: any) => {
          const path = Skia.Path.MakeFromSVGString(pathData.path);
          return path ? {...pathData, path} : null;
        })
        .filter(Boolean);

      setPaths(parsedPaths);
    } catch (error) {
      console.error('Failed to decompress or parse data:', error);
    }
  };

  const handleSyncMove = (base64EncodedData: string) => {
    try {
      const binaryString = base64.decode(base64EncodedData);
      const compressedData = Uint8Array.from(
        binaryString.split('').map(char => char.charCodeAt(0)),
      );
      const newPathData = JSON.parse(
        pako.inflate(compressedData, {to: 'string'}),
      );
      const newPath = Skia.Path.MakeFromSVGString(newPathData.path);

      if (newPath) {
        setPaths(prevPaths =>
          mergeSimilarPaths([...prevPaths, {...newPathData, path: newPath}]),
        );
      }
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
          lastMergedPath.path = mergedPath; // 병합된 경로 업데이트
        }
      } else {
        mergedPaths.push(currentPath);
      }
    });

    return mergedPaths;
  };

  return (
    <View style={styles.canvasLayout}>
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
  );
}

export default TeacherRealTimeCanvasRefSection;

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
