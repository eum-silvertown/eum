import { useEffect, useRef, useState } from 'react';
import { Canvas, Path, Skia, useCanvasRef } from '@shopify/react-native-skia';
import pako from 'pako';
import { StyleSheet, View } from 'react-native';
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
function StudentRealTimeCanvasRefSection({
  receivedMessage,
}: StudentCanvasSectionProps): React.JSX.Element {
  const canvasRef = useCanvasRef();
  const pathsRef = useRef<PathData[]>([]); // paths 상태를 useRef로 관리
  const [, forceRender] = useState(0);

  // pathsRef 업데이트와 강제 렌더링을 위한 함수
  const updatePaths = (newPaths: PathData[]) => {
    pathsRef.current = newPaths;
    forceRender((prev) => prev + 1); // 렌더링 강제 업데이트
  };

  useEffect(() => {
    if (receivedMessage) {
      // console.log('선생님의 데이터를 Ref로 전달 완료 되었습니다.', receivedMessage);

      // 메시지를 JSON으로 파싱 후 drawingData만 처리
      const messageObject = JSON.parse(receivedMessage);
      if (messageObject.drawingData) {
        handleSync(messageObject.drawingData);  // 전체 데이터 처리
        // handleSyncMove(messageObject.drawingData); // 필요에 따라 실시간 이동 데이터 처리
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receivedMessage]);

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
      console.error('Failed to decompress or parse data:', error);
    }
  };

  // const handleSyncMove = (base64EncodedData: string) => {
  //   try {
  //     const binaryString = base64.decode(base64EncodedData);
  //     const compressedData = Uint8Array.from(binaryString.split('').map(char => char.charCodeAt(0)));
  //     const newPathData = JSON.parse(pako.inflate(compressedData, { to: 'string' }));
  //     const newPath = Skia.Path.MakeFromSVGString(newPathData.path);

  //     if (newPath) {
  //       const updatedPaths = mergeSimilarPaths([...pathsRef.current, { ...newPathData, path: newPath }]);
  //       pathsRef.current = updatedPaths;
  //       forceRender((prev) => prev + 1); // 강제 렌더링
  //     }
  //   } catch (error) {
  //     console.error('Failed to decompress or parse left_to_right_move data:', error);
  //   }
  // };

  // const mergeSimilarPaths = (paths: PathData[]): PathData[] => {
  //   const mergedPaths: PathData[] = [];

  //   paths.forEach(currentPath => {
  //     const lastMergedPath = mergedPaths[mergedPaths.length - 1];

  //     if (
  //       lastMergedPath &&
  //       lastMergedPath.color === currentPath.color &&
  //       lastMergedPath.strokeWidth === currentPath.strokeWidth &&
  //       lastMergedPath.opacity === currentPath.opacity
  //     ) {
  //       const mergedPathString = lastMergedPath.path.toSVGString() + ' ' + currentPath.path.toSVGString();
  //       const mergedPath = Skia.Path.MakeFromSVGString(mergedPathString);

  //       if (mergedPath) {
  //         lastMergedPath.path = mergedPath; // 병합된 경로 업데이트
  //       }
  //     } else {
  //       mergedPaths.push(currentPath);
  //     }
  //   });

  //   return mergedPaths;
  // };

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
