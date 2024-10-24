import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import {ScreenType} from '@store/useCurrentScreenStore';
import LoginScreen from '@screens/LoginScreen';
import HomeScreen from '@screens/HomeScreen';
import ClassListScreen from '@screens/ClassListScreen';
import HomeworkScreen from '@screens/HomeworkScreen';
import ProblemBoxScreen from '@screens/ProblemBoxScreen';
import MyClassScreen from '@screens/MyClassScreen';
import MainLayout from '@components/common/MainLayout';

// 안드로이드 기본 Navbar 없애기
SystemNavigationBar.stickyImmersive();

const Stack = createNativeStackNavigator<ScreenType>();

interface ScreenProps {
  name: keyof ScreenType;
  component: () => React.JSX.Element;
}

function App(): React.JSX.Element {
  const screens: ScreenProps[] = [
    {name: 'LoginScreen', component: LoginScreen},
    {name: 'HomeScreen', component: HomeScreen},
    {name: 'ClassListScreen', component: ClassListScreen},
    {name: 'HomeworkScreen', component: HomeworkScreen},
    {name: 'ProblemBoxScreen', component: ProblemBoxScreen},
    {name: 'MyClassScreen', component: MyClassScreen},
  ];

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{animation: 'none', headerShown: false}}>
        {screens.map((screen, index) => (
          <Stack.Screen key={index} name={screen.name}>
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
