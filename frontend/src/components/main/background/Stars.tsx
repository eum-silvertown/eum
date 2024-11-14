import {getResponsiveSize} from '@utils/responsive';
import {useCallback, useEffect} from 'react';
import {Animated, StyleSheet} from 'react-native';

interface StarsProps {
  screenWidth: number;
  screenHeight: number;
}

export default function Stars({
  screenWidth,
  screenHeight,
}: StarsProps): React.JSX.Element {
  const stars = Array.from({length: 30}, (_, i) => ({
    id: i,
    x: Math.random() * screenWidth,
    y: Math.random() * (screenHeight * 0.7),
    size: getResponsiveSize(3) + Math.random() * getResponsiveSize(3),
    delay: Math.random() * 3000,
  }));
  const starAnims = stars.map(() => new Animated.Value(0));

  // 별 애니메이션
  const animateStars = useCallback(() => {
    const animations = starAnims.map((anim, index) => {
      return Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 1000 + stars[index].delay,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0.3,
          duration: 1000 + stars[index].delay,
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.parallel(animations).start(() => animateStars());
  }, [starAnims, stars]);

  useEffect(() => {
    animateStars();
  }, [animateStars]);

  return (
    <>
      {stars.map((star, index) => (
        <Animated.View
          key={star.id}
          style={[
            styles.star,
            {
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size,
              opacity: starAnims[index],
            },
          ]}
        />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  star: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
  },
});
