import {Image, StyleSheet, View, Animated, TouchableOpacity} from 'react-native';
import {Text} from '@components/common/Text';
import defaultProfileImage from '@assets/images/defaultProfileImage.png';
import {spacing} from '@theme/spacing';
import {iconSize} from '@theme/iconSize';
import useSidebarStore from '@store/useSidebarStore';
import {useEffect, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScreenType, useCurrentScreenStore} from '@store/useCurrentScreenStore';
import { useAuthStore } from '@store/useAuthStore';
import { borderWidth } from '@theme/borderWidth';
import { colors } from 'src/hooks/useColors';

type NavigationProps = NativeStackNavigationProp<ScreenType>;

function SidebarProfile(): React.JSX.Element {
  const {isExpanded} = useSidebarStore();
  const authStore = useAuthStore();
  const contentOpacity = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation<NavigationProps>();
  const {setCurrentScreen} = useCurrentScreenStore();

  useEffect(() => {
    Animated.timing(contentOpacity, {
      toValue: isExpanded ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isExpanded, contentOpacity]);

  const moveProfile = () => {
    navigation.navigate('ProfileScreen');
    setCurrentScreen('ProfileScreen');
  };

  return (
    <TouchableOpacity onPress={moveProfile} style={styles.container}>
      <View style={styles.profileImageContainer}>
        <Image style={styles.profileImage} source={authStore.userProfileImage ? {uri: authStore.userProfileImage} : defaultProfileImage} />
      </View>
      <Animated.View style={[styles.username, {opacity: contentOpacity}]}>
        <Text variant="subtitle" color="white" weight="bold" numberOfLines={1}>
          {authStore.username}
        </Text>
      </Animated.View>
    </TouchableOpacity>
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
    borderWidth: borderWidth.sm,
    borderColor: colors.light.borderColor.pickerBorder,
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
