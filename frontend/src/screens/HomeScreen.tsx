import {spacing} from '@theme/spacing';
import {
  Animated,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {useCallback, useEffect, useRef} from 'react';
import {getUserInfo} from '@services/authService';
import BookModal from '@components/common/BookModal';
import {useBookModalStore} from '@store/useBookModalStore';
import Background from '@components/main/Background';
import Widgets from '@components/main/Widgets';
import TimeTable from '@components/main/Timetable';

const STARTING_HOUR = 9;
const ENDING_HOUR = 22;
const TRANSITION_HOUR = 17;

function HomeScreen(): React.JSX.Element {
  const screenWidth = Dimensions.get('window').width;
  const bookPosition = useBookModalStore(state => state.bookPosition);
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
        const response = await getUserInfo();
      } catch (error) {}
    };

    fetchData(); // 함수 호출
  }, []);

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
      <Widgets />
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

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: spacing.xl,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    gap: spacing.lg,
    marginVertical: spacing.md,
  },
  contentTop: {
    flexDirection: 'row',
    flex: 4,
    gap: spacing.lg,
  },
  contentBottom: {
    flex: 5,
    gap: spacing.md,
  },
  scrollView: {
    position: 'absolute',
    bottom: 50,
    height: '50%',
  },
});
