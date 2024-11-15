import {useCallback, useEffect, useRef} from 'react';
import {Animated, StyleSheet, View} from 'react-native';

interface CelestialObjectsProps {
  startingHour: number;
  endingHour: number;
  transitionHour: number;
  screenWidth: number;
  timeAnim: Animated.Value;
}

function CelestialObjects({
  startingHour,
  endingHour,
  transitionHour,
  screenWidth,
  timeAnim,
}: CelestialObjectsProps): React.JSX.Element {
  const styles = getStyles(screenWidth);

  const sunAnim = useRef(new Animated.Value(0)).current;
  const moonAnim = useRef(new Animated.Value(0)).current;

  // 애니메이션이 실행 중인지 추적하는 ref
  const isAnimating = useRef(false);

  // 하늘 객체(태양/달) 애니메이션 함수
  const animateCelestialObjects = useCallback(
    (exactTime: number) => {
      // 이미 애니메이션이 실행 중이면 스킵
      if (isAnimating.current) return;

      isAnimating.current = true;

      const sunProgress = Math.min(
        1,
        Math.max(
          0,
          (exactTime - startingHour) / (transitionHour - startingHour),
        ),
      );

      const moonProgress = Math.min(
        1,
        Math.max(
          0,
          (exactTime - transitionHour) / (endingHour - transitionHour),
        ),
      );

      Animated.parallel([
        Animated.timing(sunAnim, {
          toValue: sunProgress,
          duration: 33,
          useNativeDriver: true,
        }),
        Animated.timing(moonAnim, {
          toValue: moonProgress,
          duration: 33,
          useNativeDriver: true,
        }),
      ]).start(() => {
        isAnimating.current = false;
      });
    },
    [endingHour, startingHour, sunAnim, moonAnim, transitionHour],
  );

  useEffect(() => {
    // 초기값으로 애니메이션 실행
    animateCelestialObjects(startingHour);

    const listener = timeAnim.addListener(({value}) => {
      animateCelestialObjects(value);
    });

    return () => {
      timeAnim.removeListener(listener);
    };
  }, [timeAnim, animateCelestialObjects, startingHour]);

  // 애니메이션 값들 보간
  const sunTranslateX = sunAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [screenWidth * 0.05, screenWidth - screenWidth * 0.05],
  });

  const sunTranslateY = sunAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [screenWidth * 0.2, screenWidth * 0.1, screenWidth * 0.2],
  });

  const moonTranslateX = moonAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [screenWidth * 0.05, screenWidth - screenWidth * 0.05],
  });

  const moonTranslateY = moonAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [screenWidth * 0.2, screenWidth * 0.1, screenWidth * 0.2],
  });

  const sunOpacity = sunAnim.interpolate({
    inputRange: [0.8, 1],
    outputRange: [1, 0],
  });

  const moonOpacity = moonAnim.interpolate({
    inputRange: [0, 0.2],
    outputRange: [0, 1],
  });

  return (
    <>
      <Animated.View
        style={[
          styles.celestialObject,
          {
            transform: [
              {translateX: sunTranslateX},
              {translateY: sunTranslateY},
            ],
            opacity: sunOpacity,
          },
        ]}>
        <View style={[styles.sun]}>
          <View style={styles.sunRays} />
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.celestialObject,
          {
            transform: [
              {translateX: moonTranslateX},
              {translateY: moonTranslateY},
            ],
            opacity: moonOpacity,
          },
        ]}>
        <View style={styles.moon} />
      </Animated.View>
    </>
  );
}

const getStyles = (width: number) =>
  StyleSheet.create({
    celestialObject: {
      position: 'absolute',
      width: width * 0.075,
      height: width * 0.075,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sun: {
      width: width * 0.06,
      height: width * 0.06,
      borderRadius: 9999,
      backgroundColor: '#FFD700',
      shadowColor: '#FFD700',
      shadowOffset: {width: 0, height: 0},
      shadowOpacity: 0.8,
      shadowRadius: 15,
    },
    sunRays: {
      width: width * 0.075,
      height: width * 0.075,
      position: 'absolute',
      top: -width * 0.0075,
      left: -width * 0.0075,
      borderRadius: 9999,
      borderWidth: width * 0.002,
      borderColor: '#FFD700',
      opacity: 0.5,
    },
    moon: {
      width: width * 0.075,
      height: width * 0.075,
      borderRadius: 9999,
      backgroundColor: '#F4F6F0',
      shadowColor: '#FFFFFF',
      shadowOffset: {width: 0, height: 0},
      shadowOpacity: 0.8,
      shadowRadius: 15,
    },
  });

export default CelestialObjects;
