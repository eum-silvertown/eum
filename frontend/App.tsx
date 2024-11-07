import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import {ScreenType} from '@store/useCurrentScreenStore';
import LoginScreen from '@screens/LoginScreen';
import FindIdScreen from '@screens/FindIdScreen';
import FindPasswordScreen from '@screens/FindPasswordScreen';
import SignUpSelectScreen from '@screens/SignUpSelectScreen';
import SignUpScreen from '@screens/SignUpScreen';
import HomeScreen from '@screens/HomeScreen';
import LessoningScreen from '@screens/LessoningScreen';
import ClassListScreen from '@screens/ClassListScreen';
import HomeworkScreen from '@screens/HomeworkScreen';
import QuestionBoxScreen from '@screens/QuestionBoxScreen';
import MyClassScreen from '@screens/MyClassScreen';
import NotificationScreen from '@screens/NotificationScreen';
import LessoningStudentListScreen from '@screens/LessoningStudentListScreen';
import MainLayout from '@components/common/MainLayout';
import ProfileScreen from '@screens/ProfileScreen';
import {Platform, UIManager} from 'react-native';
import React from 'react';

// 안드로이드 기본 Navbar 없애기
SystemNavigationBar.stickyImmersive();

// LayoutAnimation 설정
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const Stack = createNativeStackNavigator<ScreenType>();

interface ScreenProps {
  name: keyof ScreenType;
  component: () => React.JSX.Element;
}

function App(): React.JSX.Element {
  const screens: ScreenProps[] = [
    {name: 'LoginScreen', component: LoginScreen},
    {name: 'FindIdScreen', component: FindIdScreen},
    {name: 'FindPasswordScreen', component: FindPasswordScreen},
    {name: 'SignUpSelectScreen', component: SignUpSelectScreen},
    {name: 'SignUpScreen', component: SignUpScreen},
    {name: 'HomeScreen', component: HomeScreen},
    {name: 'ClassListScreen', component: ClassListScreen},
    {name: 'HomeworkScreen', component: HomeworkScreen},
    {name: 'QuestionBoxScreen', component: QuestionBoxScreen},
    {name: 'MyClassScreen', component: MyClassScreen},
    {name: 'NotificationScreen', component: NotificationScreen},
    {name: 'LessoningScreen', component: LessoningScreen},
    {name: 'LessoningStudentListScreen', component: LessoningStudentListScreen},
    {name: 'ProfileScreen', component: ProfileScreen},    
  ];

  return (
    <NavigationContainer>
      <MainLayout>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            animationDuration: 300,
            contentStyle: {
              backgroundColor: 'transparent',
            },
          }}>
          {screens.map((screen, index) => (
            <Stack.Screen
              key={index}
              name={screen.name}
              component={screen.component}
            />
          ))}
        </Stack.Navigator>
      </MainLayout>
    </NavigationContainer>
  );
}

export default App;
