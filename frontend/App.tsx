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
import LectureListScreen from '@screens/LectureListScreen';
import ClassDetailScreen from '@screens/ClassDetailScreen';
import HomeworkScreen from '@screens/HomeworkScreen';
import QuestionBoxScreen from '@screens/QuestionBoxScreen';
import MyClassScreen from '@screens/MyClassScreen';
import NotificationScreen from '@screens/NotificationScreen';
import LessoningStudentListScreen from '@screens/LessoningStudentListScreen';
import MainLayout from '@components/common/MainLayout';
import ProfileScreen from '@screens/ProfileScreen';
import {Platform, UIManager} from 'react-native';
import React, {useEffect, useState} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {TextEncoder} from 'text-encoding';

global.TextEncoder = TextEncoder;
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
const queryClient = new QueryClient();

function App(): React.JSX.Element {
  const [screens, setScreens] = useState<ScreenProps[]>([]);

  // const screens: ScreenProps[] = [
  //   {name: 'LoginScreen', component: LoginScreen},
  //   {name: 'HomeScreen', component: HomeScreen},
  //   {name: 'FindIdScreen', component: FindIdScreen},
  //   {name: 'FindPasswordScreen', component: FindPasswordScreen},
  //   {name: 'SignUpSelectScreen', component: SignUpSelectScreen},
  //   {name: 'SignUpScreen', component: SignUpScreen},
  //   {name: 'LectureListScreen', component: LectureListScreen},
  //   {name: 'HomeworkScreen', component: HomeworkScreen},
  //   {name: 'QuestionBoxScreen', component: QuestionBoxScreen},
  //   {name: 'MyClassScreen', component: MyClassScreen},
  //   {name: 'NotificationScreen', component: NotificationScreen},
  //   {name: 'LessoningScreen', component: LessoningScreen},
  //   {name: 'LessoningStudentListScreen', component: LessoningStudentListScreen},
  //   {name: 'ProfileScreen', component: ProfileScreen},
  //   {name: 'ClassDetailScreen', component: ClassDetailScreen},
  // ];

  useEffect(() => {
    setScreens([
      {name: 'LoginScreen', component: LoginScreen},
      {name: 'HomeScreen', component: HomeScreen},
      {name: 'FindIdScreen', component: FindIdScreen},
      {name: 'FindPasswordScreen', component: FindPasswordScreen},
      {name: 'SignUpSelectScreen', component: SignUpSelectScreen},
      {name: 'SignUpScreen', component: SignUpScreen},
      {name: 'LectureListScreen', component: LectureListScreen},
      {name: 'HomeworkScreen', component: HomeworkScreen},
      {name: 'QuestionBoxScreen', component: QuestionBoxScreen},
      {name: 'MyClassScreen', component: MyClassScreen},
      {name: 'NotificationScreen', component: NotificationScreen},
      {name: 'LessoningScreen', component: LessoningScreen},
      {
        name: 'LessoningStudentListScreen',
        component: LessoningStudentListScreen,
      },
      {name: 'ProfileScreen', component: ProfileScreen},
      {name: 'ClassDetailScreen', component: ClassDetailScreen},
    ]);
  }, []);

  if (screens.length === 0) {
    return <></>;
  }

  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

export default App;
