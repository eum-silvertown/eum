import React from 'react';
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

type ZoomableViewProps = {
  children: React.ReactNode;
};

function ZoomableView({children}: ZoomableViewProps): JSX.Element {
  const scale = useSharedValue(1);

  // Gesture API를 사용하여 핀치 제스처 생성
  const pinchGesture = Gesture.Pinch()
    .onUpdate(event => {
      scale.value = event.scale; // 현재 스케일 설정
    })
    // 제스처 끝난 후 확대/축소 상태 유지
    .onEnd(() => {});

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={pinchGesture}>
        <Animated.View style={[animatedStyle]}>{children}</Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

export default ZoomableView;
