import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import HomeScreen from './src/screens/HomeScreen';
import ClassListScreen from './src/screens/ClassListScreen';
import MainLayout from './src/components/common/MainLayout';

// 안드로이드 기본 Navbar 없애기
SystemNavigationBar.stickyImmersive();

export type RootStackParamList = {
  HomeScreen: undefined;
  ClassListScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

interface ScreenProps {
  name: keyof RootStackParamList;
  component: () => React.JSX.Element;
}

function App(): React.JSX.Element {
  const screens: ScreenProps[] = [
    {name: 'HomeScreen', component: HomeScreen},
    {name: 'ClassListScreen', component: ClassListScreen},
  ];

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{animation: 'none', headerShown: false}}>
        {screens.map(screen => (
          <Stack.Screen name={screen.name}>
            {() => (
              <MainLayout>
                <screen.component />
              </MainLayout>
            )}
          </Stack.Screen>
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
