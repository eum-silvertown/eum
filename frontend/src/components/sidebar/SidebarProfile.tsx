import {
  Image,
  StyleSheet,
  View,
  Animated,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { Text } from '@components/common/Text';
import defaultProfileImage from '@assets/images/defaultProfileImage.png';
import useSidebarStore from '@store/useSidebarStore';
import { useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenType, useCurrentScreenStore } from '@store/useCurrentScreenStore';
import { useAuthStore } from '@store/useAuthStore';
import { colors } from '@hooks/useColors';

type NavigationProps = NativeStackNavigationProp<ScreenType>;

function SidebarProfile(): React.JSX.Element {
  const { width } = useWindowDimensions();
  const styles = getStyles(width);

  const { isExpanded } = useSidebarStore();
  const authStore = useAuthStore();
  const contentOpacity = useRef(new Animated.Value(1)).current;
  const navigation = useNavigation<NavigationProps>();
  const { setCurrentScreen } = useCurrentScreenStore();

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
              ? { uri: authStore.userInfo.image.url }
              : defaultProfileImage
          }
        />
      </View>
      <Animated.View style={[styles.username, { opacity: contentOpacity }]}>
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

const getStyles = (width: number) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      height: '12.5%',
      gap: width * 0.01,
      padding: width * 0.01,
      overflow: 'hidden',
    },
    profileImageContainer: {
      width: width * 0.03,
      aspectRatio: 1,
      borderWidth: width * 0.001,
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
