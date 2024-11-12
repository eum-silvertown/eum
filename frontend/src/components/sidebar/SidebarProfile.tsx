import {
  Image,
  StyleSheet,
  View,
  Animated,
  TouchableOpacity,
} from 'react-native';
import {Text} from '@components/common/Text';
import defaultProfileImage from '@assets/images/defaultProfileImage.png';
import {spacing} from '@theme/spacing';
import useSidebarStore from '@store/useSidebarStore';
import {useEffect, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScreenType, useCurrentScreenStore} from '@store/useCurrentScreenStore';
import {useAuthStore} from '@store/useAuthStore';
import {borderWidth} from '@theme/borderWidth';
import {colors} from 'src/hooks/useColors';
import {getResponsiveSize} from '@utils/responsive';

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
        <Image
          style={styles.profileImage}
          source={
            authStore.userInfo.image
              ? {uri: authStore.userInfo.image.url}
              : defaultProfileImage
          }
        />
      </View>
      <Animated.View style={[styles.username, {opacity: contentOpacity}]}>
        <Text variant="subtitle" weight="bold" numberOfLines={1}>
          {authStore.userInfo.name}
        </Text>
        <Text>
          {authStore.userInfo.role === 'STUDENT'
            ? '학생'
            : authStore.userInfo.role === 'TEACHER'
            ? '선생님'
            : '역할 없음'}
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
    marginBottom: spacing.xs,
    padding: getResponsiveSize(7.5),
    overflow: 'hidden',
  },
  profileImageContainer: {
    width: getResponsiveSize(24),
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
