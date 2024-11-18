import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScreenType } from '@store/useCurrentScreenStore';
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
import ProfileScreen from '@screens/ProfileScreen';
import QuestionCreateScreen from '@screens/QuestionCreateScreen';
import SolveHomeworkScreen from '@screens/SolveHomeworkScreen';
import SolveExamScreen from '@screens/SolveExamScreen';
import ConfirmSolvedScreen from '@screens/ConfirmSolvedScreen';
import ClassLessonReviewScreen from '@screens/ClassLessonReviewScreen';
import ClassHomeworkListTeacherScreen from '@screens/ClassHomeworkListTeacherScreen';
import ClassExamListTeacherScreen from '@screens/ClassExamListTeacherScreen';
import ClassExamStudentSubmitListScreen from '@screens/ClassExamStudentSubmitListScreen';
import ClassHomeworkStudentSubmitListScreen from '@screens/ClassHomeworkStudentSubmitListScreen';

const Stack = createNativeStackNavigator<ScreenType>();

interface ScreenProps {
  name: keyof ScreenType;
  component: () => React.JSX.Element;
}

export const getInitialScreens = (): ScreenProps[] => [
  { name: 'LoginScreen', component: LoginScreen },
  { name: 'HomeScreen', component: HomeScreen },
  { name: 'FindIdScreen', component: FindIdScreen },
  { name: 'FindPasswordScreen', component: FindPasswordScreen },
  { name: 'SignUpSelectScreen', component: SignUpSelectScreen },
  { name: 'SignUpScreen', component: SignUpScreen },
  { name: 'ClassExamListScreen', component: ClassExamListScreen },
  { name: 'ClassListScreen', component: ClassListScreen },
  { name: 'ClassHomeworkListScreen', component: ClassHomeworkListScreen },
  { name: 'ClassLessonListScreen', component: ClassLessonListScreen },
  { name: 'HomeworkScreen', component: HomeworkScreen },
  { name: 'QuestionBoxScreen', component: QuestionBoxScreen },
  { name: 'QuestionCreateScreen', component: QuestionCreateScreen },
  { name: 'MyClassScreen', component: MyClassScreen },
  { name: 'NotificationScreen', component: NotificationScreen },
  { name: 'LessoningScreen', component: LessoningScreen },
  { name: 'LessoningStudentListScreen', component: LessoningStudentListScreen },
  { name: 'ProfileScreen', component: ProfileScreen },
  { name: 'SolveHomeworkScreen', component: SolveHomeworkScreen },
  { name: 'SolveExamScreen', component: SolveExamScreen },
  { name: 'ConfirmSolvedScreen', component: ConfirmSolvedScreen },
  { name: 'ClassLessonReviewScreen', component: ClassLessonReviewScreen },
  { name: 'ClassHomeworkListTeacherScreen', component: ClassHomeworkListTeacherScreen },
  { name: 'ClassExamListTeacherScreen', component: ClassExamListTeacherScreen },
  { name: 'ClassExamStudentSubmitListScreen', component: ClassExamStudentSubmitListScreen },
  { name: 'ClassHomeworkStudentSubmitListScreen', component: ClassHomeworkStudentSubmitListScreen },
];

export function AppNavigator({ screens }: { screens: ScreenProps[] }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'simple_push',
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
  );
}