import {Text} from '@components/common/Text';
import {LayoutChangeEvent, Pressable, StyleSheet, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

function Book(): React.JSX.Element {
  const rotateY = useSharedValue(0);
  const containerWidth = useSharedValue(0);
  const right = useSharedValue(75);
  const width = useSharedValue(25);
  const height = useSharedValue(50);

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
  }));

  const openBook = () => {
    right.value = withTiming(0, {duration: 1000});
    width.value = withTiming(50, {duration: 1000});
    height.value = withTiming(100, {duration: 1000});
    rotateY.value = withDelay(
      1000,
      withTiming(-180, {
        duration: 2000,
      }),
    );
  };

  const closeBook = () => {
    rotateY.value = withTiming(0, {
      duration: 2000,
    });
    right.value = withDelay(2000, withTiming(75, {duration: 1000}));
    width.value = withDelay(2000, withTiming(25, {duration: 1000}));
    height.value = withDelay(2000, withTiming(50, {duration: 1000}));
  };

  const onContainerLayout = (event: LayoutChangeEvent) => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const {width} = event.nativeEvent.layout;
    containerWidth.value = width;
  };

  return (
    <Animated.View
      style={[
        bookStyles,
        {
          position: 'absolute',
          backgroundColor: 'green',
        },
      ]}>
      <Pressable onPress={openBook} style={styles.bookContainer}>
        <View style={styles.rightPageContainer}>
          {/* 페이지 뒷면 */}
          <Pressable
            style={[styles.page]}
            onPress={closeBook}
            onLayout={onContainerLayout}>
            <View style={[styles.content, styles.backContent]}>
              <Text style={styles.text}>닫기</Text>
            </View>
          </Pressable>
          {/* 페이지 앞면 */}
          <Animated.View style={[styles.page, frontAnimatedStyles]}>
            <View style={[styles.content, styles.frontContent]}>
              <Text style={styles.text}>페이지 앞면</Text>
            </View>
          </Animated.View>

          {/* 페이지 뒷면 */}
          <Animated.View style={[styles.page, backAnimatedStyles]}>
            <View style={[styles.content, styles.backContent]}>
              <Text style={styles.text}>페이지 뒷면</Text>
            </View>
          </Animated.View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default Book;

const styles = StyleSheet.create({
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
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  frontContent: {
    backgroundColor: '#ff5252',
  },
  backContent: {
    backgroundColor: '#7c4dff',
  },
  text: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
