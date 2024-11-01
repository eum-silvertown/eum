// import React, {useState, useCallback, useMemo} from 'react';
// import {StyleSheet, View} from 'react-native';
// import {
//   Gesture,
//   GestureDetector,
//   GestureHandlerRootView,
// } from 'react-native-gesture-handler';
// import {useSharedValue, runOnJS} from 'react-native-reanimated';
// import {Canvas, Path, Skia, SkPath, Group} from '@shopify/react-native-skia';

// const BATCH_SIZE = 10; // 패스를 그룹화할 크기
// const MAX_PATHS = 100; // 최대 패스 개수

// interface PathGroup {
//   paths: SkPath[];
//   id: number;
// }

// const DrawingTestScreen: React.FC = () => {
//   const [pathGroups, setPathGroups] = useState<PathGroup[]>([]);
//   const currentPath = useSharedValue<SkPath>(Skia.Path.Make());
//   const groupIdCounter = useSharedValue(0);

//   // 패스 그룹 추가를 최적화
//   const addPath = useCallback((path: SkPath) => {
//     setPathGroups(prevGroups => {
//       const lastGroup = prevGroups[prevGroups.length - 1];

//       // 패스 개수가 너무 많아지면 이전 그룹들을 합쳐서 하나의 패스로 만듦
//       if (
//         prevGroups.reduce((sum, group) => sum + group.paths.length, 0) >
//         MAX_PATHS
//       ) {
//         const mergedPath = Skia.Path.Make();
//         prevGroups.forEach(group => {
//           group.paths.forEach(p => {
//             mergedPath.addPath(p);
//           });
//         });
//         return [
//           {
//             paths: [mergedPath],
//             id: ++groupIdCounter.value,
//           },
//         ];
//       }

//       // 새 그룹 생성 또는 기존 그룹에 추가
//       if (!lastGroup || lastGroup.paths.length >= BATCH_SIZE) {
//         return [
//           ...prevGroups,
//           {
//             paths: [path],
//             id: ++groupIdCounter.value,
//           },
//         ];
//       }

//       const newGroups = [...prevGroups];
//       newGroups[newGroups.length - 1] = {
//         ...lastGroup,
//         paths: [...lastGroup.paths, path],
//       };
//       return newGroups;
//     });
//   }, []);

//   const pan = Gesture.Pan()
//     .averageTouches(true)
//     .maxPointers(1)
//     .onBegin(e => {
//       const path = Skia.Path.Make();
//       path.moveTo(e.x, e.y);
//       currentPath.value = path;
//     })
//     .onChange(e => {
//       const newPath = currentPath.value.copy();
//       newPath.lineTo(e.x, e.y);
//       currentPath.value = newPath;
//     })
//     .onEnd(() => {
//       runOnJS(addPath)(currentPath.value.copy());
//     });

//   // 메모이제이션된 렌더링 컴포넌트
//   const PathGroups = useMemo(() => {
//     return pathGroups.map(group => (
//       <Group key={group.id}>
//         {group.paths.map((path, pathIndex) => (
//           <Path
//             key={`${group.id}-${pathIndex}`}
//             path={path}
//             strokeWidth={4}
//             style="stroke"
//             strokeCap="round"
//             strokeJoin="round"
//             color="white"
//           />
//         ))}
//       </Group>
//     ));
//   }, [pathGroups]);

//   return (
//     <GestureHandlerRootView style={styles.container}>
//       <View style={styles.canvasContainer}>
//         <GestureDetector gesture={pan}>
//           <Canvas style={styles.canvas}>
//             {PathGroups}
//             <Path
//               path={currentPath}
//               strokeWidth={4}
//               style="stroke"
//               strokeCap="round"
//               strokeJoin="round"
//               color="white"
//             />
//           </Canvas>
//         </GestureDetector>
//       </View>
//     </GestureHandlerRootView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   canvasContainer: {
//     flex: 1,
//   },
//   canvas: {
//     flex: 1,
//   },
// });

// export default DrawingTestScreen;

import {Canvas} from '@shopify/react-native-skia';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Shape} from 'react-native-svg';
import useCanvas from 'src/hooks/useCanvas';
import useToolbar from 'src/hooks/useToolbar';

const App = () => {
  const {tool, setTool, ...headerTools} = useToolbar();
  const {paintStyle} = headerTools;
  const {shapes, touchHandler, currentShape, onClear, undo, redo} = useCanvas({
    paintStyle,
    tool,
  });

  return (
    <View style={styles.container}>
      {/* Canvas를 감싸는 View에 touchHandler 연결 */}
      <View style={styles.canvas} {...touchHandler}>
        <Canvas style={StyleSheet.absoluteFill}>
          {shapes.map((shape, index) => (
            <Shape key={index} {...shape} />
          ))}
          {currentShape && <Shape {...currentShape} />}
        </Canvas>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvas: {
    flex: 5,
  },
});

export default App;
