import {StyleSheet, View, Text} from 'react-native';
import Sidebar from './sidebar/Sidebar';
import { useAuthStore } from '@store/useAuthStore';

interface MainLayoutProps {
  children: React.ReactElement;
}

function MainLayout({children}: MainLayoutProps): React.JSX.Element {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn); // 로그인 상태 확인

  return (
    <View style={styles.container}>            
      {isLoggedIn && <Sidebar />}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

export default MainLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
  },
});
