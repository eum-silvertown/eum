import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import {Text} from '@components/common/Text';
import defaultProfileImage from '@assets/images/defaultProfileImage.png';
import SettingIcon from '@assets/icons/settingIcon.svg';
import AlarmIcon from '@assets/icons/alarmIcon.svg';
import {spacing} from '@theme/spacing';
import {iconSize} from '@theme/iconSize';
import {ScreenType, useCurrentScreenStore} from '@store/useCurrentScreenStore';
import useSidebarStore from '@store/useSidebarStore';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {useEffect, useRef} from 'react';

type NavigationProps = NativeStackNavigationProp<ScreenType>;

function SidebarProfile(): React.JSX.Element {
  const navigation = useNavigation<NavigationProps>();
  const {setCurrentScreen} = useCurrentScreenStore();
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
      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: contentOpacity,
          },
        ]}>
        <View style={[styles.username]}>
          <Text
            variant="title"
            color="white"
            numberOfLines={1}
            style={{overflow: 'hidden'}}>
            박효진
          </Text>
          <Text
            variant="body"
            color="white"
            numberOfLines={1}
            style={{overflow: 'hidden'}}>
            학생
          </Text>
        </View>
        <View style={styles.icons}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('EditUserScreen');
              setCurrentScreen('EditUserScreen');
            }}>
            <SettingIcon width={iconSize.md} height={iconSize.md} />
          </TouchableOpacity>
          <AlarmIcon width={iconSize.md} height={iconSize.md} />
        </View>
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
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  username: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: spacing.sm,
    gap: spacing.sm,
    overflow: 'hidden',
  },
  icons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});

export default SidebarProfile;
