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
import Book from '@components/common/Book';

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
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.filter}>
            <Text>진행중인 수업</Text>
            <DropdownArrowIcon width={iconSize.xs} height={iconSize.xs} />
          </View>
        </View>
        <View style={styles.classList}>
          <Book />
        </View>
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
  content: {
    position: 'relative',
    width: '100%',
    height: '90%',
    backgroundColor: 'yellow',
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
  classList: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});
