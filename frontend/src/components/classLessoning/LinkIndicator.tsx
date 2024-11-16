import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
} from 'react-native-reanimated';

interface LinkIndicatorProps {
  isConnected: boolean;
}

const LinkIndicator: React.FC<LinkIndicatorProps> = ({ isConnected }) => {
  const scale1 = useSharedValue(1);
  const scale2 = useSharedValue(1);

  useEffect(() => {
    if (isConnected) {
      const animationDuration = 2000; // 한 애니메이션 주기의 총 시간
      const shrinkDuration = 600; // 다시 작아지는 시간
      const delayBetween = 400; // 두 원 사이의 딜레이

      // 첫 번째 원 초기 상태 설정 후 애니메이션 시작
      scale1.value = withTiming(1, { duration: 100 }, () => {
        scale1.value = withRepeat(
          withSequence(
            withTiming(1.5, { duration: animationDuration - shrinkDuration, easing: Easing.inOut(Easing.ease) }), // 커지기
            withTiming(1, { duration: shrinkDuration, easing: Easing.inOut(Easing.ease) }) // 다시 작아짐
          ),
          -1,
          false
        );
      });

      // 두 번째 원 초기 상태 설정 후 애니메이션 시작 (딜레이 적용)
      scale2.value = withTiming(1, { duration: 100 }, () => {
        scale2.value = withRepeat(
          withDelay(
            delayBetween,
            withSequence(
              withTiming(1.5, { duration: animationDuration - shrinkDuration, easing: Easing.inOut(Easing.ease) }),
              withTiming(1, { duration: shrinkDuration, easing: Easing.inOut(Easing.ease) })
            )
          ),
          -1,
          false
        );
      });
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
      <Animated.View style={[styles.circle, animatedStyle1]}>
        <View style={styles.innerCircle} />
      </Animated.View>
      <Animated.View style={[styles.circle, animatedStyle2, styles.circle2]}>
        <View style={styles.innerCircle} />
      </Animated.View>
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
    alignItems: 'center',
    justifyContent: 'center', // 내부 원 중앙 정렬
  },
  circle2: {
    marginLeft: -10, // 살짝 겹쳐진 느낌으로 배치
  },
  innerCircle: {
    width: 10, // 외부 원 대비 작은 크기
    height: 10,
    borderRadius: 5, // 내부 원도 원형으로
    backgroundColor: '#FFFFFF', // 흰색 배경
  },
});

export default LinkIndicator;
