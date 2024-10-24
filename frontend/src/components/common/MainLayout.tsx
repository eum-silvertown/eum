import {StyleSheet, View} from 'react-native';
import Sidebar from './sidebar/Sidebar';

interface MainLayoutProps {
  children: React.ReactElement;
}

function MainLayout({children}: MainLayoutProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.sidebarContainer}>
        <Sidebar />
      </View>
      <View style={styles.contentWrapper}>
        <View style={styles.content}>{children}</View>
      </View>
    </View>
  );
}

export default MainLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebarContainer: {
    // Sidebar를 고정된 위치에 배치
    zIndex: 1,
    width: '21.875%',
  },
  contentWrapper: {
    flex: 1,
    overflow: 'hidden', // 애니메이션이 Sidebar를 넘어가지 않도록
  },
  content: {
    flex: 1,
    backgroundColor: 'white', // 또는 원하는 배경색
  },
});
