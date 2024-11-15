import { useEffect, useState } from 'react';
import { Canvas, Path, Skia, useCanvasRef } from '@shopify/react-native-skia';
import pako from 'pako';
import { Dimensions, StyleSheet, View } from 'react-native';
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

function TeacherRealTimeCanvasRefSection({
  receivedMessage,
}: StudentCanvasSectionProps): React.JSX.Element {
  const canvasRef = useCanvasRef();
  const [paths, setPaths] = useState<PathData[]>([]);
  const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

  // 보정치를 위한 상태 변수
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
        const newWidthRatio = deviceWidth / messageObject.width;
        const newHeightRatio = deviceHeight / messageObject.height;

        setWidthRatio(newWidthRatio);
        setHeightRatio(newHeightRatio);

        console.log('Calculated widthRatio:', newWidthRatio);
        console.log('Calculated heightRatio:', newHeightRatio);

        handleSync(messageObject.drawingData);
        handleSyncMove(messageObject.drawingData);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receivedMessage, deviceWidth, deviceHeight]);

  const handleSync = (base64EncodedData: string) => {
    try {
      const binaryString = base64.decode(base64EncodedData);
      const compressedData = Uint8Array.from(
        binaryString.split('').map(char => char.charCodeAt(0)),
      );
      const decompressedData = JSON.parse(
        pako.inflate(compressedData, { to: 'string' }),
      );

      const parsedPaths = decompressedData
        .map((pathData: any) => {
          const pathString = pathData.path;
          const path = Skia.Path.MakeFromSVGString(pathString);
          return path ? { ...pathData, path } : null;
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
        pako.inflate(compressedData, { to: 'string' }),
      );

      const adjustedPathString = adjustPathToCurrentResolution(
        newPathData.path,
        widthRatio,
        heightRatio,
      );
      const newPath = Skia.Path.MakeFromSVGString(adjustedPathString);

      if (newPath) {
        setPaths(prevPaths =>
          mergeSimilarPaths([...prevPaths, { ...newPathData, path: newPath }]),
        );
      }
    } catch (error) {
      console.error('Failed to decompress or parse data:', error);
    }
  };

  const adjustPathToCurrentResolution = (
    pathString: string,
    reWidthRatio: number,
    reHeightRatio: number,
  ): string => {
    return pathString
      .split(' ')
      .map(segment => {
        const isCoordinate = !isNaN(parseFloat(segment));
        if (isCoordinate) {
          const number = parseFloat(segment);
          return (
            number * (segment.includes('y') ? reHeightRatio : reWidthRatio)
          ).toFixed(8);
        }
        return segment;
      })
      .join(' ');
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
            strokeWidth={strokeWidth * widthRatio}
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
  canvas: { flex: 1 },
});
