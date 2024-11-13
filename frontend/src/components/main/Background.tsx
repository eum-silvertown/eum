import React, {useCallback, useRef} from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Dimensions,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import Clouds from './background/Clouds';
import Stars from './background/Stars';
import Sky from './background/Sky';
import TimeTable from './TimeTable';
import CelestialObjects from './background/CelestialObjects';

const STARTING_HOUR = 9;
const ENDING_HOUR = 22;
const TRANSITION_HOUR = 17;

export default function Background(): React.JSX.Element {
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const timeProgressAnim = useRef(new Animated.Value(0)).current;
  const currentTimeAnim = useRef(new Animated.Value(STARTING_HOUR)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  const hourWidth = screenWidth / 4;

  // 스크롤 이벤트 핸들러
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const currentHour = Math.floor(offsetX / hourWidth) + STARTING_HOUR;
      const progress = (offsetX % hourWidth) / hourWidth;
      const exactTime = currentHour + progress;

      currentTimeAnim.setValue(exactTime);
      timeProgressAnim.setValue(
        (exactTime - STARTING_HOUR) / (ENDING_HOUR - STARTING_HOUR),
      );
    },
    [hourWidth, timeProgressAnim, currentTimeAnim],
  );

  // isNightTime을 Animated.Value로 계산
  const isNightTime = currentTimeAnim.interpolate({
    inputRange: [TRANSITION_HOUR - 1, TRANSITION_HOUR],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <Sky skyAnim={timeProgressAnim} />

      <Animated.View style={{opacity: isNightTime}}>
        <Stars screenWidth={screenWidth} screenHeight={screenHeight} />
      </Animated.View>

      <Animated.View style={{opacity: Animated.subtract(1, isNightTime)}}>
        <Clouds screenWidth={screenWidth} screenHeight={screenHeight} />
      </Animated.View>

      <CelestialObjects
        startingHour={STARTING_HOUR}
        endingHour={ENDING_HOUR}
        transitionHour={TRANSITION_HOUR}
        screenWidth={screenWidth}
        timeAnim={currentTimeAnim}
      />

      <ScrollView
        ref={scrollViewRef}
        horizontal
        style={styles.scrollView}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={33}>
        <TimeTable
          endingHour={ENDING_HOUR}
          hourWidth={hourWidth}
          isNightTime={isNightTime}
          startingHour={STARTING_HOUR}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: -1,
    width: '100%',
    height: '100%',
  },
  scrollView: {
    position: 'absolute',
    bottom: 50,
    height: '50%',
  },
});
