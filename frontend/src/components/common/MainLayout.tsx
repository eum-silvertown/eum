import {Animated, StyleSheet, View} from 'react-native';
import Sidebar from '../sidebar/Sidebar';
import useSidebarStore from '@store/useSidebarStore';
import {useEffect, useRef} from 'react';
import {useAuthStore} from '@store/useAuthStore';
import Modals from './Modals';
import {useCurrentScreenStore} from '@store/useCurrentScreenStore';
import {spacing} from '@theme/spacing';
import {getResponsiveSize} from '@utils/responsive';
import {borderRadius} from '@theme/borderRadius';

interface MainLayoutProps {
  children: React.ReactElement;
}

function MainLayout({children}: MainLayoutProps): React.JSX.Element {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn); // 로그인 상태 확인
  const {isExpanded} = useSidebarStore();
  const sidebarWidthAnim = useRef(
    new Animated.Value(isExpanded ? 17.5 : 5),
  ).current;

  // 현재 스크린
  const currentScreen = useCurrentScreenStore(state => state.currentScreen);
  console.log(currentScreen);

  // Sidebar가 보이지 않아야 하는 스크린 설정
  const screensWithoutSidebar = [
    'LessoningScreen',
    'LessoningStudentListScreen',
    'QuestionCreateScreen',
  ];

  useEffect(() => {
    Animated.timing(sidebarWidthAnim, {
      toValue: isExpanded ? 17.5 : 5,
      duration: 300,
      useNativeDriver: false,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);

  return (
    <>
      <View style={styles.container}>
        {isLoggedIn && !screensWithoutSidebar.includes(currentScreen) && (
          <Animated.View
            style={[
              styles.sidebarContainer,
              {
                width: sidebarWidthAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}>
            <Sidebar />
          </Animated.View>
        )}
        <View style={styles.contentWrapper}>{children}</View>
      </View>
      <Modals />
    </>
  );
}

export default MainLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.lg,
    padding: spacing.lg,
    backgroundColor: '#555588',
  },
  sidebarContainer: {
    backgroundColor: 'white',
    borderRadius: borderRadius.lg,
    elevation: getResponsiveSize(4),
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: spacing.lg,
    overflow: 'hidden',
    elevation: getResponsiveSize(4),
  },
});
