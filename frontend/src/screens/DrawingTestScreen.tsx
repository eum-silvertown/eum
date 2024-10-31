import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {useSharedValue, runOnJS} from 'react-native-reanimated'; // runOnJS 추가
import {Canvas, Path, Skia, SkPath} from '@shopify/react-native-skia';

const DrawingTestScreen: React.FC = () => {
  const [paths, setPaths] = useState<SkPath[]>([]);
  const currentPath = useSharedValue<SkPath>(Skia.Path.Make());

  // setPaths를 JS 스레드에서 실행할 함수로 분리
  const addPath = (path: SkPath) => {
    setPaths(prevPaths => [...prevPaths, path]);
  };

  const pan = Gesture.Pan()
    .averageTouches(true)
    .maxPointers(1)
    .onBegin(e => {
      const path = Skia.Path.Make();
      path.moveTo(e.x, e.y);
      currentPath.value = path;
    })
    .onChange(e => {
      const newPath = currentPath.value.copy();
      newPath.lineTo(e.x, e.y);
      currentPath.value = newPath;
    })
    .onEnd(() => {
      // runOnJS를 사용하여 JS 스레드에서 setPaths 실행
      runOnJS(addPath)(currentPath.value.copy());
    });

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.canvasContainer}>
        <GestureDetector gesture={pan}>
          <Canvas style={styles.canvas}>
            {paths.map((path, index) => (
              <Path
                key={index}
                path={path}
                strokeWidth={4}
                style="stroke"
                strokeCap="round"
                strokeJoin="round"
                color="black"
              />
            ))}
            <Path
              path={currentPath}
              strokeWidth={4}
              style="stroke"
              strokeCap="round"
              strokeJoin="round"
              color="black"
            />
          </Canvas>
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvasContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  canvas: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default DrawingTestScreen;
