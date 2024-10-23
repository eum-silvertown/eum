import {create} from 'zustand';

export type ScreenType = {
  HomeScreen: undefined;
  ClassListScreen: undefined;
  HomeworkScreen: undefined;
  ProblemBoxScreen: undefined;
  MyClassScreen: undefined;
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
