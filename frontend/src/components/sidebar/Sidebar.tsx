import {
  Animated,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import SidebarProfile from './SidebarProfile';
import SidebarMenus from './SidebarMenus';
import SidebarExpandIcon from '@assets/icons/sidebarExpandIcon.svg';
import useSidebarStore from '@store/useSidebarStore';
import {useEffect, useRef} from 'react';

function Sidebar(): React.JSX.Element {
  const {width} = useWindowDimensions();
  const styles = getStyles(width);

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
      toValue: isExpanded ? width * 0.15 : width * 0.05,
      duration: 300,
      useNativeDriver: false,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iconRotateAnim, isExpanded]);

  const animatedSpin = iconRotateAnim.interpolate({
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
            transform: [{rotate: animatedSpin}],
          }}>
          <SidebarExpandIcon
            width={width * 0.02}
            height={width * 0.02}
            color="#2E2559"
          />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

export default Sidebar;

const getStyles = (width: number) =>
  StyleSheet.create({
    container: {
      alignItems: 'flex-start',
      height: '100%',
      backgroundColor: 'white',
      borderRadius: 15,
      overflow: 'hidden',
    },
    sidebarExpandIcon: {
      width: width * 0.02,
      marginTop: 'auto',
      marginLeft: 'auto',
      marginHorizontal: width * 0.013,
      marginBottom: width * 0.015,
    },
  });
