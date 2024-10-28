import {create} from 'zustand';

export type ScreenType = {
  HomeScreen: undefined;
  ClassListScreen: undefined;
  HomeworkScreen: undefined;
  QuestionBoxScreen: undefined;
  MyClassScreen: undefined;
  EditUserScreen: undefined;
  LoginScreen: undefined;
  SignUpSelectScreen: undefined;
  NotificationScreen: undefined;
  ClassDetailScreen: undefined;
  LessoningScreen: undefined;
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
