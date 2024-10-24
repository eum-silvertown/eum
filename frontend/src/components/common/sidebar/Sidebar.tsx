import {StyleSheet, View} from 'react-native';
import SidebarProfile from './SidebarProfile';
import SidebarMenus from './SidebarMenus';
import {spacing} from '@theme/spacing';

function Sidebar(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <SidebarProfile />
      <SidebarMenus />
    </View>
  );
}

export default Sidebar;

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    height: '100%',
    paddingHorizontal: spacing.lg,
    backgroundColor: '#2E2559',
  },
});
