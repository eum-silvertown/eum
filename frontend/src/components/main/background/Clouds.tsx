import {useCallback, useEffect, useMemo, useRef} from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  useWindowDimensions,
  ViewStyle,
} from 'react-native';
import cloud1 from '@assets/images/cloud1.png';
import cloud2 from '@assets/images/cloud2.png';
import cloud3 from '@assets/images/cloud3.png';

interface CloudsProps {
  screenWidth: number;
  screenHeight: number;
}

const CLOUD_IMAGES = [cloud1, cloud2, cloud3];
const BASE_DURATION = 60000;
const SPEED_VARIANCE = 0.5;

export default function Clouds({
  screenWidth,
  screenHeight,
}: CloudsProps): React.JSX.Element {
  const {width} = useWindowDimensions();

  const clouds = useMemo(
    () =>
      Array.from({length: 10}, (_, i) => ({
        id: i,
        x: -width * 0.25,
        y: Math.random() * (screenHeight / 2),
        size: width * 0.075 + Math.random() * width * 0.175,
        delay: Math.random() * 20000,
        speed: 1 + (Math.random() - 0.5) * SPEED_VARIANCE * 2,
        imageSource:
          CLOUD_IMAGES[Math.floor(Math.random() * CLOUD_IMAGES.length)],
      })),
    [screenHeight, width],
  );

  const cloudAnimsRef = useRef<Animated.Value[]>(
    clouds.map(() => new Animated.Value(0)),
  );

  // 각 구름별 애니메이션 참조를 저장할 ref
  const individualAnimationsRef = useRef<Animated.CompositeAnimation[]>([]);

  // 단일 구름 애니메이션 생성 함수
  const createCloudAnimation = useCallback(
    (cloudAnim: Animated.Value, cloud: (typeof clouds)[0]) => {
      const totalDistance = screenWidth + width * 0.25;
      const duration = BASE_DURATION / cloud.speed;

      return Animated.loop(
        Animated.sequence([
          Animated.delay(cloud.delay),
          Animated.timing(cloudAnim, {
            toValue: totalDistance,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(cloudAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      );
    },
    [screenWidth],
  );

  // 모든 구름 애니메이션 시작
  const startAnimations = useCallback(() => {
    // 기존 애니메이션들 정지
    individualAnimationsRef.current.forEach(anim => anim?.stop());
    individualAnimationsRef.current = [];

    // 각 구름마다 독립적인 애니메이션 생성 및 시작
    clouds.forEach((cloud, index) => {
      const cloudAnim = cloudAnimsRef.current[index];
      const animation = createCloudAnimation(cloudAnim, cloud);
      individualAnimationsRef.current.push(animation);
      animation.start();
    });
  }, [clouds, createCloudAnimation]);

  useEffect(() => {
    startAnimations();
    return () => {
      individualAnimationsRef.current.forEach(anim => anim?.stop());
      individualAnimationsRef.current = [];
    };
  }, [startAnimations]);

  return (
    <>
      {clouds.map((cloud, index) => {
        const translateX = cloudAnimsRef.current[index];

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
            ]}>
            <Image
              source={cloud.imageSource}
              style={{width: '100%', height: '100%', objectFit: 'contain'}}
            />
          </Animated.View>
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  cloud: {
    position: 'absolute',
    zIndex: 10,
  },
});
