import {Image, StyleSheet, View, Animated} from 'react-native';
import {Text} from '@components/common/Text';
import defaultProfileImage from '@assets/images/defaultProfileImage.png';
import {spacing} from '@theme/spacing';
import {iconSize} from '@theme/iconSize';
import useSidebarStore from '@store/useSidebarStore';
import {useEffect, useRef} from 'react';

function SidebarProfile(): React.JSX.Element {
  const {isExpanded} = useSidebarStore();
  const contentOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(contentOpacity, {
      toValue: isExpanded ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isExpanded, contentOpacity]);

  return (
    <View style={styles.container}>
      <View style={styles.profileImageContainer}>
        <Image style={styles.profileImage} source={defaultProfileImage} />
      </View>
      <Animated.View style={[styles.username, {opacity: contentOpacity}]}>
        <Text variant="subtitle" color="white" weight="bold" numberOfLines={1}>
          박효진
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: '12.5%',
    gap: spacing.lg,
    padding: spacing.lg,
    overflow: 'hidden',
  },
  profileImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: iconSize.lg,
    aspectRatio: 1,
    borderRadius: 9999,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  username: {
    width: 'auto',
    overflow: 'hidden',
  },
});

export default SidebarProfile;
