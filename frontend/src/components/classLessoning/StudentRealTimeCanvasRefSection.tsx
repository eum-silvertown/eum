import {useEffect, useState} from 'react';
import {Canvas, Path, Skia, useCanvasRef} from '@shopify/react-native-skia';
import pako from 'pako';
import {Dimensions, StyleSheet, View} from 'react-native';
import base64 from 'react-native-base64';
import {useQuery} from '@tanstack/react-query';
import {getTeacherDrawingData} from '@services/lessonService';

interface StudentCanvasSectionProps {
  receivedMessage: string | null;
  isTeacherScreenOn: boolean;
  teacherId: number;
  lessonId: number;
  problemIds: number[];
  currentPage: number;
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
  teacherId,
  lessonId,
  problemIds,
  currentPage,
}: StudentCanvasSectionProps): React.JSX.Element {
  const canvasRef = useCanvasRef();

  const [paths, setPaths] = useState<PathData[][]>(
    Array.from({length: problemIds.length}, () => []), // 독립적인 배열 생성
  );
  console.log(paths);

  const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');
  const [widthRatio, setWidthRatio] = useState(1);
  const [heightRatio, setHeightRatio] = useState(1);

  // 메시지 수신 시 데이터 동기화
  useEffect(() => {
    if (receivedMessage) {
      const messageObject = JSON.parse(receivedMessage);
      console.log('receivedMessag:', receivedMessage);

      if (
        messageObject.drawingData &&
        messageObject.width &&
        messageObject.height &&
        messageObject.questionId
      ) {
        const newWidthRatio = parseFloat(
          (deviceWidth / messageObject.width).toFixed(6),
        );
        const newHeightRatio = parseFloat(
          (deviceHeight / messageObject.height).toFixed(6),
        );

        setWidthRatio(newWidthRatio);
        setHeightRatio(newHeightRatio);

        handleSync(messageObject.drawingData, messageObject.questionId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [receivedMessage]);

  // 데이터 동기화
  const handleSync = (base64EncodedData: string, questionId: number) => {
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
          const pathString = pathData.path;
          const path = Skia.Path.MakeFromSVGString(pathString);
          return path ? {...pathData, path} : null;
        })
        .filter(Boolean);

      setPaths(prevPaths => {
        const updatedPaths = [...prevPaths];
        // questionId를 기준으로 인덱스를 찾음
        const questionIndex = problemIds.indexOf(questionId);
        if (questionIndex !== -1) {
          updatedPaths[questionIndex] = mergeSimilarPaths(parsedPaths);
        }
        return updatedPaths;
      });
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

  // 선생님 그림 데이터 가져오기
  const {data: teacherDrawingData} = useQuery({
    queryKey: [
      'teacherDrawing',
      teacherId,
      lessonId,
      problemIds[currentPage - 1],
    ],
    queryFn: async () => {
      if (teacherId && lessonId && problemIds[currentPage - 1]) {
        return getTeacherDrawingData(
          teacherId,
          lessonId,
          problemIds[currentPage - 1],
        );
      }
      return null;
    },
    enabled: !!(teacherId && lessonId && problemIds[currentPage - 1]),
  });

  useEffect(() => {
    if (teacherDrawingData) {
      processCanvasData(
        teacherDrawingData.drawingData,
        teacherDrawingData.questionId,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teacherDrawingData, currentPage]);

  const processCanvasData = (base64EncodedData: string, questionId: number) => {
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
          const pathString = pathData.path;
          const path = Skia.Path.MakeFromSVGString(pathString);
          return path ? {...pathData, path} : null;
        })
        .filter(Boolean);

      setPaths(prevPaths => {
        const updatedPaths = [...prevPaths];
        const questionIndex = problemIds.indexOf(questionId);
        if (questionIndex !== -1) {
          updatedPaths[questionIndex] = mergeSimilarPaths(parsedPaths);
        }
        return updatedPaths;
      });
    } catch (error) {
      console.error('Failed to decompress or parse data:', error);
    }
  };

  return (
    <View style={styles.canvasLayout}>
      {isTeacherScreenOn && (
        <Canvas
          style={[
            styles.canvas,
            {
              transform: [
                {translateX: (deviceWidth * (1 - 1 / widthRatio)) / 2},
                {translateY: (deviceHeight * (1 - 1 / heightRatio)) / 2},
                {scaleX: widthRatio / 1},
                {scaleY: heightRatio / 1},
              ],
            },
          ]}
          ref={canvasRef}>
          {paths[currentPage - 1]?.map(
            ({path, color, strokeWidth, opacity}, index) => (
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
            ),
          )}
        </Canvas>
      )}
    </View>
  );
}

export default StudentRealTimeCanvasRefSection;

const styles = StyleSheet.create({
  canvasLayout: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  canvas: {flex: 1},
});
