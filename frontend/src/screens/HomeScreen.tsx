import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useCallback, useEffect, useRef } from 'react';
import { getUserInfo } from '@services/authService';
import BookModal from '@components/common/BookModal';
import { useBookModalStore } from '@store/useBookModalStore';
import Background from '@components/main/Background';
import Widgets from '@components/main/Widgets';
import Timetable from '@components/main/Timetable';
import { useCurrentScreenStore } from '@store/useCurrentScreenStore';
import { useFocusEffect } from '@react-navigation/native';

const STARTING_HOUR = 9;
const ENDING_HOUR = 22;
const TRANSITION_HOUR = 17;

function HomeScreen(): React.JSX.Element {
  const { width: screenWidth } = useWindowDimensions();
  const styles = getStyles(screenWidth);

  const bookPosition = useBookModalStore(state => state.bookPosition);
  const setCurrentScreen = useCurrentScreenStore(state => state.setCurrentScreen);
  const scrollViewRef = useRef<ScrollView>(null);
  const timeProgressAnim = useRef(new Animated.Value(0)).current;
  const currentTimeAnim = useRef(new Animated.Value(STARTING_HOUR)).current;

  const hourWidth = screenWidth / 4;

  const isNightTime = currentTimeAnim.interpolate({
    inputRange: [TRANSITION_HOUR - 1, TRANSITION_HOUR],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

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

  useEffect(() => {
    // 유저 정보 조회
    const fetchData = async () => {
      try {
        await getUserInfo();
      } catch (error) { }
    };

    fetchData(); // 함수 호출
  }, []);

  useFocusEffect(() => {
    setCurrentScreen('HomeScreen');
  });

  return (
    <View style={styles.container}>
      {bookPosition && <BookModal />}
      <Background
        currentTimeAnim={currentTimeAnim}
        endingHour={ENDING_HOUR}
        isNightTime={isNightTime}
        screenWidth={screenWidth}
        startingHour={STARTING_HOUR}
        timeProgressAnim={timeProgressAnim}
        transitionHour={TRANSITION_HOUR}
      />
      <Widgets isNightTime={isNightTime} />
      <ScrollView
        ref={scrollViewRef}
        horizontal
        style={styles.scrollView}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={33}>
        <Timetable
          endingHour={ENDING_HOUR}
          hourWidth={hourWidth}
          isNightTime={isNightTime}
          startingHour={STARTING_HOUR}
        />
      </ScrollView>
    </View>
  );
}

export default HomeScreen;

const getStyles = (width: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    scrollView: {
      position: 'absolute',
      bottom: width * 0.015,
      height: '50%',
    },
  });
