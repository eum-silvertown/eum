import {useLectureStore} from '@store/useLectureStore';
import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TouchableOpacity,
} from 'react-native';
import LectureCreateBook from './LectureCreateBook';
import {getResponsiveSize} from '@utils/responsive';
import TodoList from './TodoList';
import Weather from './Weather';
import {spacing} from '@theme/spacing';
import Calendar from '@components/main/MainCalendar';

interface TimeColor {
  startHour: number;
  color: string;
}

interface SkyObject {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

const STARTING_HOUR = 9;
const ENDING_HOUR = 22;
const TRANSITION_HOUR = 17; // 태양에서 달로 전환되는 시간
const TOTAL_HOURS = ENDING_HOUR - STARTING_HOUR;

const MainTest = (): React.JSX.Element => {
  const {lectures} = useLectureStore();
  const periodTimes = [8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22];

  const [backgroundAnim] = useState(new Animated.Value(0));
  const [sunAnim] = useState(new Animated.Value(0));
  const [moonAnim] = useState(new Animated.Value(0));
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentScrollTime, setCurrentScrollTime] = useState(STARTING_HOUR);

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const hourWidth = screenWidth / 4;
  const totalContentWidth = hourWidth * (TOTAL_HOURS + 1);

  // 구름 상태
  const [clouds] = useState<SkyObject[]>(
    Array.from({length: 5}, (_, i) => ({
      id: i,
      x: -100,
      y: Math.random() * (screenHeight / 3),
      size: 40 + Math.random() * 30,
      delay: Math.random() * 10000,
    })),
  );

  // 별 상태
  const [stars] = useState<SkyObject[]>(
    Array.from({length: 30}, (_, i) => ({
      id: i,
      x: Math.random() * screenWidth,
      y: Math.random() * (screenHeight * 0.7),
      size: 2 + Math.random() * 2,
      delay: Math.random() * 3000,
    })),
  );

  const [cloudAnims] = useState(() => clouds.map(() => new Animated.Value(0)));
  const [starAnims] = useState(() => stars.map(() => new Animated.Value(0)));

  const timeColors: TimeColor[] = [
    {startHour: 9, color: '#87CEEB'}, // 아침
    {startHour: 12, color: '#87CEFA'}, // 낮
    {startHour: 16, color: '#FFA07A'}, // 오후
    {startHour: 19, color: '#4B0082'}, // 저녁
    {startHour: 22, color: '#191970'}, // 밤
  ];

  // 스크롤 이벤트 핸들러
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const currentHour = Math.floor(offsetX / hourWidth) + STARTING_HOUR;
      const progress = (offsetX % hourWidth) / hourWidth;
      const exactTime = currentHour + progress;

      setCurrentScrollTime(exactTime);

      // 배경색 애니메이션 업데이트
      const timeProgress =
        (exactTime - STARTING_HOUR) / (ENDING_HOUR - STARTING_HOUR);
      backgroundAnim.setValue(timeProgress * (timeColors.length - 1));

      // 태양 위치 업데이트 (9시-17시)
      const sunProgress = Math.min(
        1,
        Math.max(
          0,
          (exactTime - STARTING_HOUR) / (TRANSITION_HOUR - STARTING_HOUR),
        ),
      );
      sunAnim.setValue(sunProgress);

      // 달 위치 업데이트 (17시-22시)
      const moonProgress = Math.min(
        1,
        Math.max(
          0,
          (exactTime - TRANSITION_HOUR) / (ENDING_HOUR - TRANSITION_HOUR),
        ),
      );
      moonAnim.setValue(moonProgress);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [backgroundAnim, sunAnim, moonAnim, hourWidth],
  );

  // 구름 애니메이션
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
    animateClouds();
    animateStars();
  }, [animateClouds, animateStars]);

  // 배경색 보간
  const interpolatedColor = backgroundAnim.interpolate({
    inputRange: timeColors.map((_, index) => index),
    outputRange: timeColors.map(color => color.color),
  });

  // 태양 위치 보간
  const sunTranslateX = sunAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-60, screenWidth + 60],
  });

  const sunTranslateY = sunAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [
      getResponsiveSize(100),
      getResponsiveSize(50),
      getResponsiveSize(100),
    ],
  });

  // 달 위치 보간
  const moonTranslateX = moonAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-60, screenWidth + 60],
  });

  const moonTranslateY = moonAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [
      getResponsiveSize(100),
      getResponsiveSize(50),
      getResponsiveSize(100),
    ],
  });

  // 태양과 달의 투명도 보간
  const sunOpacity = sunAnim.interpolate({
    inputRange: [0.8, 1],
    outputRange: [1, 0],
  });

  const moonOpacity = moonAnim.interpolate({
    inputRange: [0, 0.2],
    outputRange: [0, 1],
  });

  const isNightTime = currentScrollTime >= TRANSITION_HOUR;

  // 시간 목록 렌더링 함수
  const renderTimeList = () => {
    const times = [];
    for (let hour = STARTING_HOUR; hour <= ENDING_HOUR; hour++) {
      times.push(
        <View key={hour} style={[styles.timeBlock, {width: hourWidth}]}>
          <View style={styles.timeContent}>
            {lectures.map(
              lecture =>
                lecture.lecturePeriod &&
                periodTimes[lecture.lecturePeriod] === hour && (
                  <TouchableOpacity
                    key={lecture.lectureId}
                    style={{
                      height: getResponsiveSize(150),
                      overflow: 'hidden',
                    }}>
                    <LectureCreateBook key={lecture.lectureId} item={lecture} />
                  </TouchableOpacity>
                ),
            )}
            <View style={styles.timeIndicator} />
            <View style={styles.timeTextContainer}>
              <Animated.Text
                style={[
                  styles.timeText,
                  {color: isNightTime ? '#FFF' : '#000'},
                ]}>
                {`${hour}:00`}
              </Animated.Text>
            </View>
          </View>
        </View>,
      );
    }
    return times;
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.background,
          {
            backgroundColor: interpolatedColor,
          },
        ]}
      />

      {/* 밤에는 별 표시 */}
      {isNightTime && (
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
      )}

      {/* 낮에는 구름 표시 */}
      {!isNightTime && (
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
      )}

      {/* 태양 */}
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

      {/* 달 */}
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

      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          height: '40%',
          gap: spacing.lg,
          padding: spacing.xl,
        }}>
        <TodoList />
        <Weather />
        <Calendar />
      </View>
      {/* 시간 스크롤 뷰는 동일하게 유지 */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        style={styles.scrollView}
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: new Animated.Value(0)}}}],
          {
            useNativeDriver: false,
            listener: handleScroll,
          },
        )}
        scrollEventThrottle={16}>
        <View style={[styles.timeContainer, {width: totalContentWidth}]}>
          {renderTimeList()}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  celestialObject: {
    position: 'absolute',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sun: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
  sunRays: {
    width: 60,
    height: 60,
    position: 'absolute',
    top: -5,
    left: -5,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#FFD700',
    opacity: 0.5,
  },
  moon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F4F6F0',
    shadowColor: '#FFFFFF',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
  star: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
  },
  cloud: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  scrollView: {
    position: 'absolute',
    bottom: 50,
    height: '50%',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  timeBlock: {
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  timeContent: {
    alignItems: 'center',
  },
  timeIndicator: {
    width: 2,
    height: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 5,
  },
  timeTextContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MainTest;
