import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import {ScreenType} from '@store/useCurrentScreenStore';
import HomeScreen from '@screens/HomeScreen';
import ClassListScreen from '@screens/ClassListScreen';
import HomeworkScreen from '@screens/HomeworkScreen';
import QuestionBoxScreen from '@screens/QuestionBoxScreen';
import MyClassScreen from '@screens/MyClassScreen';
import EditUserScreen from '@screens/EditUserScreen';
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
    {name: 'HomeScreen', component: HomeScreen},
    {name: 'ClassListScreen', component: ClassListScreen},
    {name: 'HomeworkScreen', component: HomeworkScreen},
    {name: 'QuestionBoxScreen', component: QuestionBoxScreen},
    {name: 'MyClassScreen', component: MyClassScreen},
    {name: 'EditUserScreen', component: EditUserScreen},
  ];

  return (
    <NavigationContainer>
      <MainLayout>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            // content 영역만 애니메이션 되도록 스타일 설정
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
