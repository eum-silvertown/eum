import {LayoutChangeEvent, Pressable, StyleSheet, View} from 'react-native';
import {useBookModalStore} from '@store/useBookModalStore';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import {useEffect, useRef} from 'react';
import Lecture from '@components/main/Lecture';
import {spacing} from '@theme/spacing';

function BookModal(): React.JSX.Element {
  const containerRef = useRef<View>(null);
  const containerPosition = useBookModalStore(state => state.containerPosition);
  const setContainerPosition = useBookModalStore(
    state => state.setContainerPosition,
  );
  const isBookOpened = useBookModalStore(state => state.isBookOpened);
  const bookPosition = useBookModalStore(state => state.bookPosition);
  const bookInfo = useBookModalStore(state => state.bookInfo);
  const closeBook = useBookModalStore(state => state.closeBook);

  // 애니메이션 속성
  const ANIM_DURATION = 300;
  const rotateY = useSharedValue(0);
  const containerWidth = useSharedValue(0);
  const top = useSharedValue(bookPosition ? bookPosition.y - spacing.lg : 0);
  const left = useSharedValue(
    bookPosition && containerPosition
      ? bookPosition.x - containerPosition.x + spacing.xl
      : 0,
  );
  const width = useSharedValue(bookPosition ? bookPosition.width : 0);
  const height = useSharedValue(bookPosition ? bookPosition.height : 0);

  // 표지 애니메이션 스타일
  const coverAnimatedStyles = useAnimatedStyle(() => ({
    transform: [
      {perspective: 30000},
      {translateX: -containerWidth.value / 2},
      {rotateY: `${rotateY.value}deg`},
      {translateX: containerWidth.value / 2},
    ],
  }));

  // 표지 뒷면 애니메이션 스타일
  const coverBehindAnimatedStyles = useAnimatedStyle(() => ({
    transform: [
      {perspective: 30000},
      {translateX: -containerWidth.value / 2},
      {rotateY: `${rotateY.value + 180}deg`},
      {translateX: -containerWidth.value / 2},
    ],
  }));

  const bookStyles = useAnimatedStyle(() => ({
    top: top.value,
    left: left.value,
    width: width.value,
    height: height.value,
  }));

  useEffect(() => {
    if (containerPosition) {
      if (isBookOpened) {
        top.value = withTiming(0, {duration: ANIM_DURATION});
        left.value = withTiming(containerPosition.width / 2, {
          duration: ANIM_DURATION,
        });
        width.value = withTiming(containerPosition.width / 2, {
          duration: ANIM_DURATION,
        });
        height.value = withTiming(containerPosition.height, {
          duration: ANIM_DURATION,
        });
        rotateY.value = withDelay(
          ANIM_DURATION,
          withTiming(-180, {
            duration: ANIM_DURATION * 2,
          }),
        );
      } else if (bookPosition && bookInfo) {
        rotateY.value = withTiming(0, {
          duration: ANIM_DURATION * 2,
        });
        top.value = withDelay(
          ANIM_DURATION * 2,
          withTiming(bookPosition.y - spacing.lg, {
            duration: ANIM_DURATION,
          }),
        );
        left.value = withDelay(
          ANIM_DURATION * 2,
          withTiming(bookPosition.x - containerPosition.x + spacing.xl, {
            duration: ANIM_DURATION,
          }),
        );
        width.value = withDelay(
          ANIM_DURATION * 2,
          withTiming(bookPosition.width, {duration: ANIM_DURATION}),
        );
        height.value = withDelay(
          ANIM_DURATION * 2,
          withTiming(bookPosition.height, {duration: ANIM_DURATION}),
        );
      }
    }
  }, [
    bookInfo,
    bookPosition,
    containerPosition,
    height,
    isBookOpened,
    left,
    rotateY,
    top,
    width,
  ]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.measureInWindow((x, y, width, height) => {
        console.log('Container coordinates:', x, y, width, height);
        setContainerPosition({
          x,
          y,
          width,
          height,
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!bookPosition || !bookInfo) {
    return <></>;
  }

  const onContainerLayout = (event: LayoutChangeEvent) => {
    const {width} = event.nativeEvent.layout;
    containerWidth.value = width;
  };

  return (
    <View
      style={styles.container}
      ref={containerRef}
      onLayout={() => {
        // 레이아웃이 변경될 때마다 위치 재측정
        if (containerRef.current) {
          containerRef.current.measureInWindow((x, y, width, height) => {
            setContainerPosition({
              x,
              y,
              width,
              height,
            });
          });
        }
      }}>
      <Animated.View style={[bookStyles]}>
        <Pressable
          onPress={() => closeBook(ANIM_DURATION)}
          style={styles.bookContainer}>
          <View style={styles.rightPageContainer}>
            {/* 오른쪽 페이지 (펼침)*/}
            <View style={styles.page}>
              <View
                style={[styles.content, styles.backContent]}
                onLayout={onContainerLayout}
              />
            </View>
            {/* 표지 */}
            <Animated.View style={[styles.page, coverAnimatedStyles]}>
              <Lecture
                item={{
                  title: bookInfo.title,
                  backgroundColor: bookInfo.backgroundColor,
                  fontColor: bookInfo.fontColor,
                  grade: bookInfo.grade,
                  classNumber: bookInfo.classNumber,
                  teacherName: bookInfo.teacherName,
                  subject: bookInfo.subtitle,
                }}
              />
            </Animated.View>
            {/* 왼쪽 페이지 (펼침) */}
            <Animated.View style={[styles.page, coverBehindAnimatedStyles]}>
              <View style={[styles.content, styles.backContent]} />
            </Animated.View>
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

export default BookModal;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 10,
    width: '100%',
    height: '100%',
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
