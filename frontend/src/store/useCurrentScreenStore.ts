import {create} from 'zustand';

export type ScreenType = {
  HomeScreen: undefined;
  LectureListScreen: undefined;
  HomeworkScreen: undefined;
  QuestionBoxScreen: undefined;
  MyClassScreen: undefined;
  LoginScreen: undefined;
  FindIdScreen: undefined;
  FindPasswordScreen: undefined | {userId?: string; email?: string};
  SignUpSelectScreen: undefined;
  SignUpScreen: undefined | {userType: 'teacher' | 'student'};
  NotificationScreen: undefined;
  LessoningScreen: undefined;
  LessoningStudentListScreen: undefined;
  ProfileScreen: undefined;
  ClassListScreen: undefined;
  QuestionCreateScreen: {
    lectureId: number;
    action: 'lesson' | 'exam' | 'homework';
  };
  ClassLessonListScreen: undefined;
  ClassExamListScreen: undefined;
  ClassExamListTeacherScreen: undefined;
  ClassHomeworkListScreen: undefined;
  ClassHomeworkListTeacherScreen: undefined;
  SolveHomeworkScreen: {homeworkId: number; questionIds: number[]};
  SolveExamScreen: {examId: number; questionIds: number[]};
  ConfirmSolvedScreen: {
    typeId: number;
    questionIds: number[];
    solvedType: 'EXAM' | 'HOMEWORK' | 'LESSON';
  };
  ClassLessonReviewScreen: { lessonId: number };
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
