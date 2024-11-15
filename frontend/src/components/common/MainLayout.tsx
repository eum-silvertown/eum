import {StyleSheet, useWindowDimensions, View} from 'react-native';
import Sidebar from '../sidebar/Sidebar';
import {useAuthStore} from '@store/useAuthStore';
import Modals from './Modals';
import {useCurrentScreenStore} from '@store/useCurrentScreenStore';

interface MainLayoutProps {
  children: React.ReactElement;
}

function MainLayout({children}: MainLayoutProps): React.JSX.Element {
  const {width} = useWindowDimensions();
  const styles = getStyles(width);

  const isLoggedIn = useAuthStore(state => state.isLoggedIn); // 로그인 상태 확인

  // 현재 스크린
  const currentScreen = useCurrentScreenStore(state => state.currentScreen);
  console.log(currentScreen);

  // Sidebar가 보이지 않아야 하는 스크린 설정
  const screensWithoutSidebar = [
    'LessoningScreen',
    'LessoningStudentListScreen',
    'QuestionCreateScreen',
  ];

  return (
    <>
      <View style={styles.container}>
        {isLoggedIn && !screensWithoutSidebar.includes(currentScreen) && (
          <Sidebar />
        )}
        <View style={styles.contentWrapper}>{children}</View>
      </View>
      <Modals />
    </>
  );
}

export default MainLayout;

const getStyles = (width: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      gap: width * 0.0075,
      padding: width * 0.0075,
      backgroundColor: '#555588',
    },
    contentWrapper: {
      flex: 1,
      backgroundColor: 'white',
      borderRadius: width * 0.01,
      overflow: 'hidden',
      elevation: 5,
    },
  });
