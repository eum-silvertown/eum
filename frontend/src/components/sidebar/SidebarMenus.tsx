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
import {useCallback, useEffect, useRef} from 'react';

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

  const handlePress = useCallback(
    (screen: keyof ScreenType) => {
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
      {menuItems.map(item => (
        <Pressable
          style={({pressed}) => [
            styles.menuContainer,
            pressed && {opacity: 0.7},
          ]}
          android_ripple={{color: 'rgba(255, 255, 255, 0.1)'}}
          key={item.screen}
          onPress={() => handlePress(item.screen)}>
          <View style={styles.icon}>
            <item.icon width={iconSize.md} height={iconSize.md} />
          </View>
          <Animated.View
            style={[
              styles.textContainer,
              {
                opacity: textOpacity,
              },
            ]}>
            <Text weight={'bold'} color={'white'} numberOfLines={1}>
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
  icon: {
    alignItems: 'center',
    padding: spacing.md,
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