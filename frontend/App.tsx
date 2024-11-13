import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from '@services/NavigationService';
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
import ClassExamListScreen from '@screens/ClassExamListScreen';
import ClassHomeworkListScreen from '@screens/ClassHomeworkListScreen';
import ClassLessonListScreen from '@screens/ClassLessonListScreen';
import HomeworkScreen from '@screens/homework/HomeworkScreen';
import QuestionBoxScreen from '@screens/QuestionBoxScreen';
import MyClassScreen from '@screens/myClass/MyClassScreen';
import NotificationScreen from '@screens/notification/NotificationScreen';
import LessoningStudentListScreen from '@screens/LessoningStudentListScreen';
import MainLayout from '@components/common/MainLayout';
import ProfileScreen from '@screens/ProfileScreen';
import QuestionCreateScreen from '@screens/QuestionCreateScreen';

import {Platform, UIManager} from 'react-native';
import React, {useEffect, useState} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {TextEncoder} from 'text-encoding';
import {getAutoLoginStatus} from '@utils/secureStorage';
import {refreshAuthToken} from '@services/authService';
import {useAuthStore} from '@store/useAuthStore';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

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
  const setIsLoggedIn = useAuthStore(state => state.setIsLoggedIn);

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
  // ];

  useEffect(() => {
    const initializeScreens = async () => {
      const autoLoginEnabled = true // 항상 자동 로그인
      console.log('자동 로그인 여부 체크 :', autoLoginEnabled);
      const initialScreens: ScreenProps[] = [
        {name: 'LoginScreen', component: LoginScreen},
        {name: 'HomeScreen', component: HomeScreen},
        {name: 'FindIdScreen', component: FindIdScreen},
        {name: 'FindPasswordScreen', component: FindPasswordScreen},
        {name: 'SignUpSelectScreen', component: SignUpSelectScreen},
        {name: 'SignUpScreen', component: SignUpScreen},
        {name: 'ClassExamListScreen', component: ClassExamListScreen},
        {name: 'ClassListScreen', component: ClassListScreen},
        {name: 'ClassHomeworkListScreen', component: ClassHomeworkListScreen},
        {name: 'ClassLessonListScreen', component: ClassLessonListScreen},
        {name: 'HomeworkScreen', component: HomeworkScreen},
        {name: 'QuestionBoxScreen', component: QuestionBoxScreen},
        {name: 'QuestionCreateScreen', component: QuestionCreateScreen},
        {name: 'MyClassScreen', component: MyClassScreen},
        {name: 'NotificationScreen', component: NotificationScreen},
        {name: 'LessoningScreen', component: LessoningScreen},
        {
          name: 'LessoningStudentListScreen',
          component: LessoningStudentListScreen,
        },
        {name: 'ProfileScreen', component: ProfileScreen},
      ];

      if (autoLoginEnabled) {
        try {
          await refreshAuthToken();
          setIsLoggedIn(true);
          // HomeScreen을 0번 인덱스로, LoginScreen을 1번 인덱스로 설정
          [initialScreens[0], initialScreens[1]] = [
            initialScreens[1],
            initialScreens[0],
          ];
        } catch (error) {
          console.log('Token refresh error:', error);
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
      setScreens(initialScreens);
    };

    initializeScreens();
  }, [setIsLoggedIn]);

  if (screens.length === 0) {
    return <></>;
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer ref={navigationRef}>
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
    </GestureHandlerRootView>
  );
}

export default App;
