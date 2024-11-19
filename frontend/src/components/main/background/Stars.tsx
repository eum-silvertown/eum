import {useCallback, useEffect, useMemo, useRef} from 'react';
import {Animated, StyleSheet} from 'react-native';

interface StarsProps {
  screenWidth: number;
  screenHeight: number;
}

export default function Stars({
  screenWidth,
  screenHeight,
}: StarsProps): React.JSX.Element {
  // useMemo를 사용하여 stars 배열 메모이제이션
  const stars = useMemo(
    () =>
      Array.from({length: 30}, (_, i) => ({
        id: i,
        x: Math.random() * screenWidth,
        y: Math.random() * (screenHeight * 0.7),
        size: screenWidth * 0.0015 + Math.random() * screenWidth * 0.0015,
        delay: Math.random() * 3000,
      })),
    [screenWidth, screenHeight],
  );

  // useRef를 사용하여 animation 객체들을 저장
  const starAnimsRef = useRef<Animated.Value[]>();
  if (!starAnimsRef.current) {
    starAnimsRef.current = stars.map(() => new Animated.Value(0));
  }

  // 애니메이션 참조를 저장하기 위한 ref
  const animationRef = useRef<Animated.CompositeAnimation>();

  const animateStars = useCallback(() => {
    if (!starAnimsRef.current) return;

    const animations = starAnimsRef.current.map((anim, index) => {
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

    // 이전 애니메이션 중지
    animationRef.current?.stop();

    // 새 애니메이션 시작 및 저장
    animationRef.current = Animated.parallel(animations);
    animationRef.current.start(() => {
      if (!animationRef.current) return;
      animateStars();
    });
  }, [stars]);

  useEffect(() => {
    animateStars();

    // cleanup 함수
    return () => {
      animationRef.current?.stop();
      animationRef.current = undefined;
    };
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
              opacity: starAnimsRef.current?.[index],
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
    borderRadius: 9999,
  },
});
