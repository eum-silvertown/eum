import {borderRadius} from '@theme/borderRadius';
import {getResponsiveSize} from '@utils/responsive';
import {useCallback, useEffect} from 'react';
import {Animated, StyleSheet} from 'react-native';

interface CloudsProps {
  screenWidth: number;
  screenHeight: number;
}

export default function Clouds({
  screenWidth,
  screenHeight,
}: CloudsProps): React.JSX.Element {
  const clouds = Array.from({length: 10}, (_, i) => ({
    id: i,
    x: -100,
    y: Math.random() * (screenHeight / 3),
    size: getResponsiveSize(32) + Math.random() * getResponsiveSize(24),
    delay: Math.random() * 10000,
  }));
  const cloudAnims = clouds.map(() => new Animated.Value(0));

  const animateClouds = useCallback(() => {
    const animations = cloudAnims.map((anim, index) => {
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

    Animated.parallel(animations).start(() => animateClouds());
  }, [cloudAnims, clouds, screenWidth]);

  useEffect(() => {
    animateClouds();
  }, [animateClouds]);

  return (
    <>
      {clouds.map((cloud, index) => (
        <Animated.View
          key={cloud.id}
          style={[
            styles.cloud,
            {
              left: cloud.x,
              top: cloud.y,
              width: cloud.size,
              height: cloud.size * 0.6,
              transform: [
                {
                  translateX: cloudAnims[index],
                },
              ],
            },
          ]}
        />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  cloud: {
    position: 'absolute',
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: borderRadius.lg,
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
