import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  withSequence,
} from 'react-native-reanimated';

interface LinkIndicatorProps {
  isConnected: boolean;
}

const LinkIndicator: React.FC<LinkIndicatorProps> = ({ isConnected }) => {
  const scale1 = useSharedValue(1);
  const scale2 = useSharedValue(1);

  useEffect(() => {
    if (isConnected) {
      // 첫 번째 원 애니메이션
      scale1.value = withRepeat(
        withSequence(
          withTiming(1.5, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        false,
      );

      // 두 번째 원 애니메이션 (첫 번째 원과 약간의 딜레이)
      scale2.value = withRepeat(
        withDelay(
          300,
          withSequence(
            withTiming(1.5, { duration: 600, easing: Easing.inOut(Easing.ease) }),
            withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          ),
        ),
        -1,
        false,
      );
    } else {
      // 연결 끊김 상태에서 정적 유지
      scale1.value = 1;
      scale2.value = 1;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  const animatedStyle1 = useAnimatedStyle(() => ({
    transform: [{ scale: scale1.value }],
    backgroundColor: isConnected ? '#2E2559' : '#BDBDBD',
  }));

  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [{ scale: scale2.value }],
    backgroundColor: isConnected ? '#2E2559' : '#BDBDBD',
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.circle, animatedStyle1]} />
      <Animated.View style={[styles.circle, animatedStyle2, styles.circle2]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginHorizontal: 5,
    backgroundColor: '#2E2559', // 기본 연결된 상태 색상
  },
  circle2: {
    marginLeft: -10, // 살짝 겹쳐진 느낌으로 배치
  },
});

export default LinkIndicator;
