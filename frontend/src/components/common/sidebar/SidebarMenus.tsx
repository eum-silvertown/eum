import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {ScreenType, useCurrentScreenStore} from '@store/useCurrentScreenStore';
import HomeIcon from '@assets/icons/homeIcon.svg';
import ClassIcon from '@assets/icons/classIcon.svg';
import HomeworkIcon from '@assets/icons/homeworkIcon.svg';
import questionBoxIcon from '@assets/icons/questionBoxIcon.svg';
import myClassIcon from '@assets/icons/myClassIcon.svg';
import {Text} from '../Text';
import {SvgProps} from 'react-native-svg';
import {spacing} from '@theme/spacing';
import {iconSize} from '@theme/iconSize';

interface MenuItem {
  name: string;
  screen: keyof ScreenType;
  icon: React.FC<SvgProps>;
}

type NavigationProps = NativeStackNavigationProp<ScreenType>;

function SidebarMenus(): React.JSX.Element {
  const menuItems: MenuItem[] = [
    {name: '홈', screen: 'HomeScreen', icon: HomeIcon},
    {name: '수업 목록', screen: 'ClassListScreen', icon: ClassIcon},
    {name: '숙제', screen: 'HomeworkScreen', icon: HomeworkIcon},
    {name: '문제 보관함', screen: 'QuestionBoxScreen', icon: questionBoxIcon},
    {name: '우리 반', screen: 'MyClassScreen', icon: myClassIcon},
  ];
  const navigation = useNavigation<NavigationProps>();
  const {currentScreen, setCurrentScreen} = useCurrentScreenStore();

  console.log(currentScreen);
  return (
    <View style={styles.container}>
      {menuItems.map(item => (
        <TouchableOpacity
          style={styles.menuContainer}
          key={item.screen}
          onPress={() => {
            navigation.navigate(item.screen);
            setCurrentScreen(item.screen);
          }}>
          <View style={styles.icon}>
            <item.icon width={iconSize.md} height={iconSize.md} />
          </View>
          <Text weight={'bold'} color={'white'}>
            {item.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default SidebarMenus;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: spacing.xl,
  },
  icon: {
    width: '15%',
    alignItems: 'center',
  },
  menuContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
});
