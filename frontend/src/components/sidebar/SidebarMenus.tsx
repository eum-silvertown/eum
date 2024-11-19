import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  StyleSheet,
  View,
  Animated,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { ScreenType, useCurrentScreenStore } from '@store/useCurrentScreenStore';
import useSidebarStore from '@store/useSidebarStore';
import HomeIcon from '@assets/icons/homeIcon.svg';
import ClassIcon from '@assets/icons/classIcon.svg';
import HomeworkIcon from '@assets/icons/homeworkIcon.svg';
import questionBoxIcon from '@assets/icons/questionBoxIcon.svg';
import NotificationIcon from '@assets/icons/notificationIcon.svg';
import { Text } from '../common/Text';
import { SvgProps } from 'react-native-svg';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNotificationStore } from '@store/useNotificationStore';
import { useAuthStore } from '@store/useAuthStore';

interface MenuItem {
  name: string;
  screen: keyof ScreenType;
  icon: React.FC<SvgProps>;
}

type NavigationProps = NativeStackNavigationProp<ScreenType>;

function SidebarMenus(): React.JSX.Element {
  const { width } = useWindowDimensions();
  const styles = useMemo(() => getStyles(width), [width]);

  const role = useAuthStore(state => state.userInfo.role);

  const unreadNotifications = useNotificationStore(
    state => state.unreadNotifications,
  );

  const menuItems: MenuItem[] = useMemo(() => {
    const baseMenuItems: MenuItem[] = [
      { name: '홈', screen: 'HomeScreen', icon: HomeIcon },
      { name: '알림', screen: 'NotificationScreen', icon: NotificationIcon },
      { name: '수업 목록', screen: 'ClassListScreen', icon: ClassIcon },
    ];

    if (role === 'STUDENT') {
      return [...baseMenuItems, { name: '숙제', screen: 'HomeworkScreen', icon: HomeworkIcon }];
    }

    if (role === 'TEACHER') {
      return [...baseMenuItems, { name: '문제 보관함', screen: 'QuestionBoxScreen', icon: questionBoxIcon }];
    }

    return baseMenuItems;
  }, [role]);

  const navigation = useNavigation<NavigationProps>();
  const { setCurrentScreen, currentScreen } = useCurrentScreenStore();
  const { isExpanded } = useSidebarStore();
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const [selected, setSelected] = useState(0);

  const handlePress = useCallback(
    (index: number, screen: keyof ScreenType) => {
      setSelected(index);
      if (currentScreen !== screen) {
        setCurrentScreen(screen);
        requestAnimationFrame(() => {
          navigation.reset({ routes: [{ name: screen }] });
        });
      }
    },
    [navigation, setCurrentScreen, currentScreen],
  );

  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: isExpanded ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isExpanded, opacityAnim]);

  useEffect(() => {
    const currentIndex = menuItems.findIndex(item => item.screen === currentScreen);
    if (currentIndex !== -1) {
      setSelected(currentIndex);
    } else if (currentScreen === 'ProfileScreen') {
      setSelected(-1);
    }
  }, [currentScreen, menuItems]);

  return (
    <View style={styles.container}>
      {menuItems.map((item, index) => (
        <Pressable
          style={[styles.menuContainer]}
          key={index}
          onPress={() => handlePress(index, item.screen)}>
          {item.name === '알림' && unreadNotifications.length > 0 && (
            <View
              style={{
                position: 'absolute',
                zIndex: 1000,
                top: '20%',
                left: width * 0.01,
                padding: width * 0.001,
                backgroundColor: 'red',
                borderRadius: width * 0.005,
                elevation: 5,
              }}>
              <Text variant="caption" color="white" weight="medium">
                {unreadNotifications.length}
              </Text>
            </View>
          )}
          <View
            style={[
              styles.menu,
              // eslint-disable-next-line react-native/no-inline-styles
              {
                backgroundColor: selected === index ? '#2e2559' : 'white',
                elevation: selected === index ? 3 : 0,
              },
            ]}>
            <View style={styles.icon}>
              <item.icon
                width={width * 0.02}
                height={width * 0.0175}
                color={selected === index ? 'white' : '#2E2559'}
              />
            </View>
            <Animated.View
              style={[
                styles.textContainer,
                {
                  opacity: opacityAnim,
                },
              ]}>
              <Text
                weight={'bold'}
                color={selected === index ? 'white' : 'main'}
                numberOfLines={1}>
                {item.name}
              </Text>
            </Animated.View>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const getStyles = (width: number) =>
  StyleSheet.create({
    container: {
      width: '100%',
      gap: width * 0.005,
    },
    icon: {
      alignItems: 'center',
    },
    menuContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: width * 0.0075,
      paddingVertical: width * 0.004,
    },
    menu: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      gap: width * 0.01,
      paddingHorizontal: width * 0.0075,
      paddingVertical: width * 0.0075,
      borderRadius: width * 0.0075,
    },
    textContainer: {
      overflow: 'hidden',
    },
  });

export default SidebarMenus;
