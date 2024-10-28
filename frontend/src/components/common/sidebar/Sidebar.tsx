import {Animated, Image, Pressable, StyleSheet} from 'react-native';
import SidebarProfile from './SidebarProfile';
import SidebarMenus from './SidebarMenus';
import {spacing} from '@theme/spacing';
import SidebarExpandIcon from '@assets/icons/sidebarExpandIcon.svg';
import {iconSize} from '@theme/iconSize';
import useSidebarStore from '@store/useSidebarStore';
import {useEffect, useRef} from 'react';
import SidebarImage from '@assets/images/sidebarLogo.png';
import {getResponsiveSize} from '@utils/responsive';

function Sidebar(): React.JSX.Element {
  const {isExpanded, toggleSidebar} = useSidebarStore();
  const iconPositionAnim = useRef(new Animated.Value(spacing.lg)).current;
  const iconRotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(iconPositionAnim, {
        toValue: isExpanded ? spacing.lg : -spacing.lg,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(iconRotateAnim, {
        toValue: isExpanded ? 0 : 1,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);

  const spin = iconRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <Animated.View style={styles.container}>
      <SidebarProfile />
      <SidebarMenus />
      <Pressable
        onPress={toggleSidebar}
        style={{
          position: 'absolute',
          bottom: spacing.xl,
          right: spacing.xl,
        }}>
        <Animated.View
          style={{
            transform: [{rotate: spin}],
          }}>
          <SidebarExpandIcon width={iconSize.md} height={iconSize.md} />
        </Animated.View>
      </Pressable>
      <Image source={SidebarImage} style={styles.sidebarImage} />
    </Animated.View>
  );
}

export default Sidebar;

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    height: '100%',
    paddingHorizontal: spacing.lg,
    backgroundColor: '#2E2559',
    overflow: 'hidden',
  },
  sidebarExpandIcon: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
  },
  sidebarImage: {
    position: 'absolute',
    zIndex: -1,
    left: 0,
    bottom: '12.5%',
    width: getResponsiveSize(280),
    height: getResponsiveSize(392),
  },
});
