import {create} from 'zustand';

export type ScreenType = {
  HomeScreen: undefined;
  ClassListScreen: undefined;
  HomeworkScreen: undefined;
  QuestionBoxScreen: undefined;
  MyClassScreen: undefined;
  ClassDetailScreen: undefined;
  LoginScreen: undefined;
  FindIdScreen: undefined;
  FindPasswordScreen: undefined | {userId?: string; email?: string};
  SignUpSelectScreen: undefined;
  SignUpScreen: undefined | {userType: 'teacher' | 'student'};
  NotificationScreen: undefined;
  LessoningScreen: undefined;
  LessoningStudentListScreen: undefined;
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
