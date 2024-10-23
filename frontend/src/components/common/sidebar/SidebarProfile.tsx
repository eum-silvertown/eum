import {Image, StyleSheet, View} from 'react-native';
import {Text} from '@components/common/Text';
import defaultProfileImage from '@assets/images/defaultProfileImage.png';
import SettingIcon from '@assets/icons/settingIcon.svg';
import AlarmIcon from '@assets/icons/alarmIcon.svg';
import {spacing} from '@theme/spacing';
import {iconSize} from '@theme/iconSize';

function SidebarProfile(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.profileImageContainer}>
        <Image style={styles.profileImage} source={defaultProfileImage} />
      </View>
      <View style={styles.username}>
        <Text variant="title" color="white">
          박효진
        </Text>
        <Text variant="body" color="white">
          학생
        </Text>
      </View>
      <View style={styles.icons}>
        <SettingIcon width={iconSize.md} height={iconSize.md} />
        <AlarmIcon width={iconSize.md} height={iconSize.md} />
      </View>
    </View>
  );
}

export default SidebarProfile;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '12.5%',
    gap: spacing.sm,
  },
  profileImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '15%',
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: spacing.sm,
    gap: spacing.sm,
  },
  icons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});
