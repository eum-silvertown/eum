import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../../App';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

interface MenuItem {
  name: string;
  screen: keyof RootStackParamList;
}

interface SidebarProps {
  currentScreen: string;
  setCurrentScreen: React.Dispatch<
    React.SetStateAction<keyof RootStackParamList>
  >;
}

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

function Sidebar({
  currentScreen,
  setCurrentScreen,
}: SidebarProps): React.JSX.Element {
  const menuItems: MenuItem[] = [
    {name: 'Home', screen: 'HomeScreen'},
    {name: 'ClassList', screen: 'ClassListScreen'},
  ];
  const navigation = useNavigation<NavigationProps>();
  console.log(currentScreen);
  return (
    <View style={styles.container}>
      {menuItems.map(item => (
        <TouchableOpacity
          key={item.screen}
          onPress={() => {
            navigation.navigate(item.screen);
            setCurrentScreen(item.screen);
          }}>
          <Text style={styles.navigatorItem}>{item.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default Sidebar;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '15%',
    height: '100%',
    backgroundColor: '#2E2559',
  },
  navigatorItem: {
    color: 'white',
  },
});
