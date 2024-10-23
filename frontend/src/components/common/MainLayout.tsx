import {StyleSheet, View} from 'react-native';
import Sidebar from './sidebar/Sidebar';

interface MainLayoutProps {
  children: React.ReactElement;
}

function MainLayout({children}: MainLayoutProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Sidebar />
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
