import Lecture from '@components/main/Lecture';
import ClassDetailScreen from '@screens/ClassDetailScreen';
import {spacing} from '@theme/spacing';
import {useState} from 'react';
import {LayoutChangeEvent, Pressable, StyleSheet, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  withSequence,
} from 'react-native-reanimated';

interface BookProp {
  rightPosition: number;
  title: string;
  subtitle: string;
  backgroundColor: string;
  fontColor: string;
  grade: string;
  classNumber: string;
  teacherName: string;
}

function Book({
  rightPosition,
  title,
  subtitle,
  backgroundColor,
  fontColor,
  grade,
  classNumber,
  teacherName,
}: BookProp): React.JSX.Element {
  const rotateY = useSharedValue(0);
  const containerWidth = useSharedValue(0);
  const right = useSharedValue(75 - rightPosition);
  const width = useSharedValue(25);
  const height = useSharedValue(50);
  const padding = useSharedValue(spacing.lg);
  const detailOpacity = useSharedValue(0);
  const [selected, setSelected] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const ANIM_DURATION = 500;

  const lectureItem = {
    title,
    backgroundColor,
    fontColor,
    grade,
    classNumber,
    teacherName,
    subject: subtitle, // 예: 과목명을 subtitle로 사용
  };

  // 배경 DetailScreen 애니메이션 스타일
  const detailScreenStyle = useAnimatedStyle(() => ({
    opacity: detailOpacity.value,
    position: 'absolute',
    left: '-100%',
    width: '200%',
    height: '100%',
    zIndex: 1,
  }));

  // 앞면 애니메이션 스타일
  const frontAnimatedStyles = useAnimatedStyle(() => ({
    transform: [
      {perspective: 30000},
      {translateX: -containerWidth.value / 2},
      {rotateY: `${rotateY.value}deg`},
      {translateX: containerWidth.value / 2},
    ],
  }));

  // 뒷면 애니메이션 스타일
  const backAnimatedStyles = useAnimatedStyle(() => ({
    transform: [
      {perspective: 30000},
      {translateX: -containerWidth.value / 2},
      {rotateY: `${rotateY.value + 180}deg`},
      {translateX: -containerWidth.value / 2},
    ],
  }));

  const bookStyles = useAnimatedStyle(() => ({
    right: `${right.value}%`,
    width: `${width.value}%`,
    height: `${height.value}%`,
    padding: padding.value,
  }));

  const openBook = () => {
    setSelected(true);
    // DetailScreen 컴포넌트를 마운트
    setTimeout(() => {
      setShowDetail(true);
    }, ANIM_DURATION * 2.5);

    // DetailScreen을 서서히 나타나게 함
    detailOpacity.value = withSequence(
      withDelay(
        ANIM_DURATION * 2.5,
        withTiming(1, {duration: ANIM_DURATION / 2}),
      ),
    );

    right.value = withTiming(0, {duration: ANIM_DURATION});
    width.value = withTiming(50, {duration: ANIM_DURATION});
    height.value = withTiming(100, {duration: ANIM_DURATION});
    padding.value = withTiming(0, {duration: ANIM_DURATION});
    rotateY.value = withDelay(
      ANIM_DURATION,
      withTiming(-180, {
        duration: ANIM_DURATION * 2,
      }),
    );
  };

  const closeBook = () => {
    // DetailScreen을 서서히 사라지게 함
    detailOpacity.value = withTiming(0, {duration: ANIM_DURATION / 2});
    setTimeout(() => {
      setShowDetail(false);
    }, ANIM_DURATION / 2);

    rotateY.value = withTiming(0, {
      duration: ANIM_DURATION * 2,
    });
    right.value = withDelay(
      ANIM_DURATION * 2,
      withTiming(75 - rightPosition, {duration: ANIM_DURATION}),
    );
    width.value = withDelay(
      ANIM_DURATION * 2,
      withTiming(25, {duration: ANIM_DURATION}),
    );
    height.value = withDelay(
      ANIM_DURATION * 2,
      withTiming(50, {duration: ANIM_DURATION}),
    );
    padding.value = withDelay(
      ANIM_DURATION * 2,
      withTiming(spacing.lg, {duration: ANIM_DURATION}),
    );

    setTimeout(() => {
      setSelected(false);
      // 애니메이션이 완전히 끝난 후 DetailScreen 언마운트
    }, 3000);
  };

  const onContainerLayout = (event: LayoutChangeEvent) => {
    const {width} = event.nativeEvent.layout;
    containerWidth.value = width;
  };

  return (
    <Animated.View
      style={[
        bookStyles,
        styles.container,
        {
          zIndex: selected ? 1 : 0,
        },
      ]}>
      {showDetail && (
        <Animated.View style={detailScreenStyle}>
          <ClassDetailScreen closeBook={closeBook} />
        </Animated.View>
      )}

      <Pressable onPress={openBook} style={styles.bookContainer}>
        <View style={styles.rightPageContainer}>
          {/* 오른쪽 페이지 (펼침)*/}
          <View style={styles.page}>
            <View
              style={[styles.content, styles.backContent]}
              onLayout={onContainerLayout}
            />
          </View>
          {/* 표지 */}
          <Animated.View style={[styles.page, frontAnimatedStyles]}>
            <Lecture item={lectureItem} />
          </Animated.View>
          {/* 왼쪽 페이지 (펼침) */}
          <Animated.View style={[styles.page, backAnimatedStyles]}>
            <View style={[styles.content, styles.backContent]} />
          </Animated.View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default Book;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
  bookContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  rightPageContainer: {
    flex: 1,
    height: '100%',
    position: 'relative',
  },
  page: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
  },
  content: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backContent: {
    backgroundColor: 'white',
  },
});
