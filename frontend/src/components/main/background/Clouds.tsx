import {useCallback, useEffect, useMemo, useRef} from 'react';
import {Animated, StyleSheet, ViewStyle} from 'react-native';

interface CloudsProps {
  screenWidth: number;
  screenHeight: number;
}

export default function Clouds({
  screenWidth,
  screenHeight,
}: CloudsProps): React.JSX.Element {
  const clouds = useMemo(
    () =>
      Array.from({length: 10}, (_, i) => ({
        id: i,
        x: -100,
        y: Math.random() * (screenHeight / 3),
        size: 43 + Math.random() * 32,
        delay: Math.random() * 10000,
      })),
    [screenHeight],
  );

  const cloudAnimsRef = useRef<Animated.Value[]>();
  if (!cloudAnimsRef.current) {
    cloudAnimsRef.current = clouds.map(() => new Animated.Value(0));
  }

  const animationRef = useRef<Animated.CompositeAnimation>();

  const animateClouds = useCallback(() => {
    if (!cloudAnimsRef.current) return;

    const animations = cloudAnimsRef.current.map((anim, index) => {
      const totalDistance = screenWidth + clouds[index].size + 200;

      return Animated.sequence([
        Animated.delay(clouds[index].delay),
        Animated.timing(anim, {
          toValue: totalDistance,
          duration: 30000,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]);
    });

    animationRef.current?.stop();
    animationRef.current = Animated.parallel(animations);
    animationRef.current.start(() => {
      if (!animationRef.current) return;
      animateClouds();
    });
  }, [clouds, screenWidth]);

  useEffect(() => {
    animateClouds();
    return () => {
      animationRef.current?.stop();
      animationRef.current = undefined;
    };
  }, [animateClouds]);

  return (
    <>
      {clouds.map((cloud, index) => {
        // cloudAnimsRef.current가 없을 경우의 기본값 처리
        const translateX =
          cloudAnimsRef.current?.[index] || new Animated.Value(0);

        return (
          <Animated.View
            key={cloud.id}
            style={[
              styles.cloud,
              {
                left: cloud.x,
                top: cloud.y,
                width: cloud.size,
                height: cloud.size * 0.6,
                transform: [{translateX}] as Animated.WithAnimatedValue<
                  ViewStyle['transform']
                >,
              },
            ]}
          />
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  cloud: {
    position: 'absolute',
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
});
