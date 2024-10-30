import {useEffect, useState, useRef} from 'react';
import {View, Button, StyleSheet} from 'react-native';
import {Skia, useCanvasRef, Canvas, Path} from '@shopify/react-native-skia';

type PathData = {
  path: any;
  color: string;
  strokeWidth: number;
  opacity: number;
  timestamp: number; // timestamp 포함
};

interface RightCanvasSectionProps {
  recordedPaths: PathData[]; // LeftCanvasSection에서 전달받는 녹화된 드로잉 데이터
}

function RightRecordCanvasSection({
  recordedPaths,
}: RightCanvasSectionProps): React.JSX.Element {
  const canvasRef = useCanvasRef();
  const [isPlaying, setIsPlaying] = useState(false);
  const [displayPaths, setDisplayPaths] = useState<PathData[]>([]);

  const playbackIndex = useRef(0);

  const startPlayback = () => {
    console.log('재생할 데이터', recordedPaths);

    setIsPlaying(true);
    playbackIndex.current = 0;
    setDisplayPaths([]); // 기존 드로잉 초기화
  };

  const stopPlayback = () => {
    setIsPlaying(false);
  };

  useEffect(() => {
    if (!isPlaying || recordedPaths.length === 0) {
      return;
    }

    const playNextPath = () => {
      if (playbackIndex.current >= recordedPaths.length) {
        stopPlayback();
        return;
      }

      const currentPathData = recordedPaths[playbackIndex.current];
      const skiaPath = Skia.Path.MakeFromSVGString(currentPathData.path);

      if (skiaPath) {
        setDisplayPaths(prevPaths => [
          ...prevPaths,
          {...currentPathData, path: skiaPath},
        ]);
      }

      playbackIndex.current += 1;

      if (playbackIndex.current < recordedPaths.length) {
        const nextTimestamp = recordedPaths[playbackIndex.current].timestamp;
        const delay = nextTimestamp - currentPathData.timestamp;
        console.log('딜레이: ', delay);
        setTimeout(playNextPath, delay); // 다음 path 재생까지 대기
      }
    };

    playNextPath(); // 재생 시작
  }, [isPlaying, recordedPaths]);

  return (
    <View style={styles.canvasLayout}>
      <Canvas ref={canvasRef} style={styles.canvas}>
        {displayPaths.map(({path, color, strokeWidth, opacity}, index) => (
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
      <View style={styles.buttonContainer}>
        <Button
          title={isPlaying ? 'Stop Playback' : 'Start Playback'}
          onPress={isPlaying ? stopPlayback : startPlayback}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvas: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1, // Canvas가 뒤에 배치되도록 설정
    flex: 1,
  },
  buttonContainer: {
    zIndex: 2, // 버튼이 Canvas 위에 오도록 설정
  },
  canvasLayout: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default RightRecordCanvasSection;
