import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StyleSheet, View, Animated, Pressable} from 'react-native';
import {ScreenType, useCurrentScreenStore} from '@store/useCurrentScreenStore';
import useSidebarStore from '@store/useSidebarStore';
import HomeIcon from '@assets/icons/homeIcon.svg';
import ClassIcon from '@assets/icons/classIcon.svg';
import HomeworkIcon from '@assets/icons/homeworkIcon.svg';
import questionBoxIcon from '@assets/icons/questionBoxIcon.svg';
import myClassIcon from '@assets/icons/myClassIcon.svg';
import NotificationIcon from '@assets/icons/notificationIcon.svg';
import {Text} from '../common/Text';
import {SvgProps} from 'react-native-svg';
import {spacing} from '@theme/spacing';
import {iconSize} from '@theme/iconSize';
import {useCallback, useEffect, useRef, useState} from 'react';
import {borderRadius} from '@theme/borderRadius';
import {getResponsiveSize} from '@utils/responsive';

interface MenuItem {
  name: string;
  screen: keyof ScreenType;
  icon: React.FC<SvgProps>;
}

type NavigationProps = NativeStackNavigationProp<ScreenType>;

function SidebarMenus(): React.JSX.Element {
  const menuItems: MenuItem[] = [
    {name: '홈', screen: 'HomeScreen', icon: HomeIcon},
    {name: '알림', screen: 'NotificationScreen', icon: NotificationIcon},
    {name: '수업 목록', screen: 'ClassListScreen', icon: ClassIcon},
    {name: '숙제', screen: 'HomeworkScreen', icon: HomeworkIcon},
    {name: '문제 보관함', screen: 'QuestionBoxScreen', icon: questionBoxIcon},
    {name: '우리 반', screen: 'MyClassScreen', icon: myClassIcon},
  ];
  const navigation = useNavigation<NavigationProps>();
  const {setCurrentScreen, currentScreen} = useCurrentScreenStore();
  const {isExpanded} = useSidebarStore();
  const textOpacity = useRef(new Animated.Value(1)).current;
  const [selected, setSelected] = useState(0);

  const handlePress = useCallback(
    (index: number, screen: keyof ScreenType) => {
      setSelected(index);
      if (currentScreen !== screen) {
        setCurrentScreen(screen);
        requestAnimationFrame(() => {
          navigation.reset({routes: [{name: screen}]});
        });
      }
    },
    [navigation, setCurrentScreen, currentScreen],
  );

  useEffect(() => {
    Animated.timing(textOpacity, {
      toValue: isExpanded ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isExpanded, textOpacity]);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.selectedBackgroundContainer,
          {
            transform: [
              {translateY: selected * (iconSize.md + spacing.lg * 2.54)},
            ],
          },
        ]}>
        <View style={styles.selectedBackground} />
      </View>
      {menuItems.map((item, index) => (
        <Pressable
          style={styles.menuContainer}
          key={index}
          onPress={() => handlePress(index, item.screen)}>
          <View style={styles.icon}>
            <item.icon
              width={iconSize.md}
              height={iconSize.md}
              color={selected === index ? 'white' : '#2E2559'}
            />
          </View>
          <Animated.View
            style={[
              styles.textContainer,
              {
                opacity: textOpacity,
              },
            ]}>
            <Text
              weight={'bold'}
              color={selected === index ? 'white' : 'main'}
              numberOfLines={1}>
              {item.name}
            </Text>
          </Animated.View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  selectedBackgroundContainer: {
    position: 'absolute',
    width: '100%',
    height: iconSize.md + spacing.lg * 2.5,
    padding: spacing.md,
  },
  selectedBackground: {
    flex: 1,
    backgroundColor: '#2e2559',
    borderRadius: borderRadius.lg,
  },
  icon: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md + getResponsiveSize(3),
  },
  menuContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    padding: spacing.lg,
  },
  textContainer: {
    width: 'auto',
    overflow: 'hidden',
  },
});

export default SidebarMenus;
