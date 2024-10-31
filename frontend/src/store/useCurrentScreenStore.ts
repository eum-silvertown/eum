import {create} from 'zustand';

export type ScreenType = {
  HomeScreen: undefined;
  ClassListScreen: undefined;
  HomeworkScreen: undefined;
  QuestionBoxScreen: undefined;
  MyClassScreen: undefined;
  LoginScreen: undefined;
  FindIdScreen: undefined;
  FindPasswordScreen: undefined | { userId?: string, email?: string };
  SignUpSelectScreen: undefined;
<<<<<<< HEAD
  SignUpScreen: {userType: 'teacher' | 'student'};
=======
  SignUpScreen : undefined | { userType: 'teacher' | 'student' };
>>>>>>> 2abef4a4381b9e3e686ecbe92de682683945363f
  NotificationScreen: undefined;
  ClassDetailScreen: undefined;
  LessoningScreen: undefined;
  DrawingTestScreen: undefined;
};

type ScreenName = keyof ScreenType;

interface ScreenState {
  currentScreen: ScreenName;
  setCurrentScreen: (newScreen: ScreenName) => void;
}

export const useCurrentScreenStore = create<ScreenState>(set => ({
  currentScreen: 'HomeScreen',
  setCurrentScreen: newScreen => set({currentScreen: newScreen}),
}));
