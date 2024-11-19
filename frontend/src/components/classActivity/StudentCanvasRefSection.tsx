import { useEffect, useState } from 'react';
import { Canvas, Path, Skia, useCanvasRef } from '@shopify/react-native-skia';
import pako from 'pako';
import { StyleSheet, View } from 'react-native';
import base64 from 'react-native-base64';

type PathData = {
  path: any;
  color: string;
  strokeWidth: number;
  opacity: number;
};

interface StudentCanvasRefSectionProps {
  studentDrawing: string; // studentDrawing 추가
}

function StudentCanvasRefSection({
  studentDrawing,
}: StudentCanvasRefSectionProps): React.JSX.Element {
  const canvasRef = useCanvasRef();
  const [paths, setPaths] = useState<PathData[]>([]);

  useEffect(() => {
    if (studentDrawing) {
      processCanvasData(studentDrawing); // 전달받은 studentDrawing 처리
    }
  }, [studentDrawing]);

  const processCanvasData = (base64EncodedData: string) => {
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

  return (
    <View style={styles.canvasLayout}>
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
  );
}

export default StudentCanvasRefSection;

const styles = StyleSheet.create({
  canvasLayout: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  canvas: { flex: 1 },
});
