import {View, StyleSheet, Pressable, Animated} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ScreenType} from '@store/useCurrentScreenStore';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {spacing} from '@theme/spacing';
import ScreenInfo from '@components/common/ScreenInfo';
import {borderRadius} from '@theme/borderRadius';
import {Text} from '@components/common/Text';
import {getResponsiveSize} from '@utils/responsive';
import DropdownArrowIcon from '@assets/icons/dropdownArrowIcon.svg';
import {iconSize} from '@theme/iconSize';
import {useRef} from 'react';

type NavigationProps = NativeStackNavigationProp<ScreenType>;

function ClassListScreen(): React.JSX.Element {
  const navigation = useNavigation<NavigationProps>();

  // 샘플 데이터 (클래스 리스트)
  const classData = [
    {id: '1', title: '수학', color: '#ff0000'},
    {id: '2', title: '영어', color: '#0000ff'},
    {id: '3', title: '과학', color: '#00ff00'},
    {id: '4', title: '국어', color: '#ffff00'},
  ];
  const pressAnimations = useRef(
    classData.map(() => new Animated.Value(0)),
  ).current;

  const handlePress = () => {
    navigation.navigate('ClassDetailScreen');
  };

  const animatePress = (index: number, pressed: boolean) => {
    Animated.timing(pressAnimations[index], {
      toValue: pressed ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.container}>
      <ScreenInfo title="수업" />
      <View style={styles.header}>
        <View style={styles.filter}>
          <Text>진행중인 수업</Text>
          <DropdownArrowIcon width={iconSize.xs} height={iconSize.xs} />
        </View>
      </View>
      <View style={styles.classList}>
        {classData.map((data, index) => (
          <View
            style={[styles.classCard3D, {backgroundColor: 'gray'}]}
            key={data.id}>
            <Pressable
              onPress={() => handlePress()}
              onPressIn={() => animatePress(index, true)}
              onPressOut={() => animatePress(index, false)}
              style={({}) => [styles.classCard, {}]}>
              {({}) => (
                <Animated.View
                  style={[
                    styles.cardContent,
                    {
                      backgroundColor: pressAnimations[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [data.color, `${data.color}cc`],
                      }),
                    },
                  ]}>
                  <View style={styles.bookTitle}>
                    <Text variant="title" color="white" weight="medium">
                      {data.title}
                    </Text>
                  </View>
                  <View style={styles.bookDesc}>
                    <Text>설명</Text>
                  </View>
                </Animated.View>
              )}
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}

export default ClassListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xxl,
  },
  classList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    gap: spacing.xxl,
  },
  header: {
    height: '7.5%',
    marginLeft: 'auto',
    marginRight: spacing.xxl,
  },
  filter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    backgroundColor: '#EBEBEB',
    borderRadius: borderRadius.md,
  },
  classCard3D: {
    width: `${(100 - 5 * 3) / 4}%`,
    height: '50%',
    borderRadius: borderRadius.md,
  },
  classCard: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    bottom: spacing.md,
    right: spacing.md,
    borderRadius: borderRadius.md,
    elevation: getResponsiveSize(2),
    overflow: 'hidden',
  },
  cardContent: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.md,
  },
  bookTitle: {
    height: '66%',
    padding: spacing.lg,
  },
  bookDesc: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: 'white',
    borderBottomLeftRadius: borderRadius.md,
    borderBottomRightRadius: borderRadius.md,
  },
});
