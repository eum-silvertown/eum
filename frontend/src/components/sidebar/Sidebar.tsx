import {Animated, Pressable, StyleSheet} from 'react-native';
import SidebarProfile from './SidebarProfile';
import SidebarMenus from './SidebarMenus';
import SidebarExpandIcon from '@assets/icons/sidebarExpandIcon.svg';
import {iconSize} from '@theme/iconSize';
import useSidebarStore from '@store/useSidebarStore';
import {useEffect, useRef} from 'react';

function Sidebar(): React.JSX.Element {
  const {isExpanded, toggleSidebar} = useSidebarStore();
  const iconRotateAnim = useRef(new Animated.Value(0)).current;
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(iconRotateAnim, {
      toValue: isExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    Animated.timing(widthAnim, {
      toValue: isExpanded ? 280 : 84,
      duration: 300,
      useNativeDriver: false,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iconRotateAnim, isExpanded]);

  const spin = iconRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <Animated.View style={[styles.container, {width: widthAnim}]}>
      <SidebarProfile />
      <SidebarMenus />
      <Pressable onPress={toggleSidebar} style={styles.sidebarExpandIcon}>
        <Animated.View
          style={{
            transform: [{rotate: spin}],
          }}>
          <SidebarExpandIcon
            width={iconSize.md}
            height={iconSize.md}
            color="#2E2559"
          />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

export default Sidebar;

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 15,
    overflow: 'hidden',
  },
  sidebarExpandIcon: {
    marginTop: 'auto',
    marginLeft: 'auto',
    padding: 26,
  },
});
