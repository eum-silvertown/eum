import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import messaging from '@react-native-firebase/messaging';
import { navigationRef } from './src/services/NavigationService';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { ScreenType, useCurrentScreenStore } from './src/store/useCurrentScreenStore';
import MainLayout from './src/components/common/MainLayout';
import { Keyboard, Pressable, TouchableWithoutFeedback, useWindowDimensions, View } from 'react-native';
import { Platform, UIManager } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TextEncoder } from 'text-encoding';
import { refreshAuthToken } from './src/services/authService';
import { useAuthStore } from './src/store/useAuthStore';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  saveFCMToken,
  getUnreadNotifications,
  getReadNotifications,
} from './src/services/notificationService';
import { useNotificationStore } from './src/store/useNotificationStore';
import { AppNavigator, getInitialScreens } from './src/AppNavigator';
import { Text } from './src/components/common/Text';

global.TextEncoder = TextEncoder;
// 안드로이드 기본 Navbar 없애기
SystemNavigationBar.stickyImmersive();

// LayoutAnimation 설정
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface ScreenProps {
  name: keyof ScreenType;
  component: () => React.JSX.Element;
}
const queryClient = new QueryClient();

function App(): React.JSX.Element {
  const { width, height } = useWindowDimensions();
  const styles = getStyles(width, height);

  // 로그인 상태 관리
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  const setIsLoggedIn = useAuthStore(state => state.setIsLoggedIn);

  // screen 상태 관리
  const [screens, setScreens] = useState<ScreenProps[]>([]);
  const setCurrentScreen = useCurrentScreenStore(state => state.setCurrentScreen);

  // 로그인 여부에 따라 초기 화면 설정
  useEffect(() => {
    const initializeScreens = async () => {
      const autoLoginEnabled = true; // 항상 자동 로그인
      console.log('자동 로그인 여부 체크 :', autoLoginEnabled);
      const initialScreens = getInitialScreens() as ScreenProps[];

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

  // FCM 토큰 관리
  async function getFCMToken() {
    const token = await messaging().getToken();
    saveFCMToken(token);
  }

  // 알림 초기 상태 설정
  async function fetchNotifications() {
    try {
      const unreadNotifications = await getUnreadNotifications();
      setUnreadNotifications(unreadNotifications);
      const readNotifications = await getReadNotifications();
      setReadNotifications(readNotifications);
    } catch (error) {
      console.error('Failed to fetch Notifications');
    }
  }

  // 알림 상태 관리
  const setUnreadNotifications = useNotificationStore(
    state => state.setUnreadNotifications,
  );
  const setReadNotifications = useNotificationStore(
    state => state.setReadNotifications,
  );

  // 로그인 시 FCM 토큰 DB에 저장
  useEffect(() => {
    if (isLoggedIn) {
      fetchNotifications();
      getFCMToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  const toastConfig = useMemo(() => ({
    // eslint-disable-next-line react/no-unstable-nested-components
    info: (props: any) => (
      <Pressable
        style={styles.toastContainer}

        onPress={() => {
          switch (props.props.type) {
            case '수업 생성':
              setCurrentScreen('ClassListScreen');
              navigationRef.navigate('ClassListScreen');
              break;
            case '수업 시작':
              console.log(props.props);
              setCurrentScreen('ClassListScreen');
              navigationRef.navigate('ClassListScreen', {
                autoOpenLectureId: props.props.id,
              });
              break;
            case '시험 생성':
              setCurrentScreen('ClassListScreen');
              navigationRef.navigate('ClassListScreen');
              break;
            case '숙제 생성':
              setCurrentScreen('HomeworkScreen');
              navigationRef.navigate('HomeworkScreen');
              break;
          }
          props.hide();
        }}>
        <Text
          style={{
            fontSize: width * 0.01,
            fontWeight: '600',
            color: '#000000',
          }}>
          {props.text1}
        </Text>
        {props.text2 && (
          <Text
            style={{
              fontSize: width * 0.0075,
              color: '#666666',
              marginTop: width * 0.005,
            }}>
            {props.text2}
          </Text>
        )}
      </Pressable>
    ),
  }), [styles.toastContainer, width]);

  // 알림 수신 관리
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(remoteMessage);
      Toast.show({
        type: 'info',
        text1: remoteMessage.data?.type as string,
        text2: remoteMessage.notification?.title,
        position: 'top',
        visibilityTime: 10000,
        props: remoteMessage.data,
      });
    });

    return unsubscribe;
  }, []);

  // 초기 화면 설정 전까지 빈 화면 반환
  if (screens.length === 0) {
    return <></>;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{ flex: 1 }}>
          <QueryClientProvider client={queryClient}>
            <NavigationContainer ref={navigationRef}>
              <MainLayout>
                <AppNavigator screens={screens} />
              </MainLayout>
            </NavigationContainer>
          </QueryClientProvider>
        </View>
      </TouchableWithoutFeedback>
      <Toast config={toastConfig} />
    </GestureHandlerRootView>
  );
}

export default App;

const getStyles = (width: number, height: number) => ({
  toastContainer: {
    width: width * 0.5,
    backgroundColor: '#FFFFFF',
    borderRadius: width * 0.01,
    padding: width * 0.01,
    minHeight: height * 0.1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
