import {Text} from '@components/common/Text';
import {borderRadius} from '@theme/borderRadius';
import {iconSize} from '@theme/iconSize';
import {spacing} from '@theme/spacing';
import {StyleSheet, View} from 'react-native';
import CancelIcon from '@assets/icons/cancelIcon.svg';
import ScreenInfo from '@components/common/ScreenInfo';

function NotificationScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <ScreenInfo title="알림 센터" />
      <View style={styles.contentContainer}>
        <View style={styles.notifications}>
          <View>
            <Text variant="body" weight="medium">
              안 읽은 알림 5
            </Text>
          </View>
          {[...Array(5)].map((_, index) => (
            <View key={index} style={styles.notification}>
              <View style={styles.icon}></View>
              <View>
                <Text weight="bold">수업 알림</Text>
              </View>
              <View>
                <Text>국어 수업 시작 5분 전입니다.</Text>
              </View>
              <View style={styles.notificationTail}>
                <Text variant="caption" color="secondary">
                  2024. 11. 11 08:55
                </Text>
                <CancelIcon width={iconSize.sm} height={iconSize.sm} />
              </View>
            </View>
          ))}
        </View>
        <View style={styles.buttons}>
          <View style={styles.button}>
            <Text>디데이 설정 같은 거?</Text>
          </View>
          <View style={styles.button}>
            <Text>하이 ㅎ</Text>
          </View>
          <View style={styles.button}>
            <Text>하이 ㅎ</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xxl,
    backgroundColor: 'white',
  },
  contentContainer: {
    flexDirection: 'row',
    width: '100%',
    height: '92%',
    gap: spacing.xl,
  },
  notifications: {
    width: '75%',
    height: '100%',
    gap: spacing.lg,
    padding: spacing.lg,
    backgroundColor: 'white',
    elevation: 2,
    borderRadius: borderRadius.lg,
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '10%',
    gap: spacing.xl,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    backgroundColor: 'white',
    elevation: 1,
    borderRadius: borderRadius.md,
  },
  icon: {
    width: iconSize.lg,
    height: iconSize.lg,
    borderRadius: 9999,
    backgroundColor: 'gray',
  },
  notificationTail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginLeft: 'auto',
  },
  buttons: {flex: 1, gap: spacing.lg},
  button: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: 'white',
    elevation: 2,
    borderRadius: borderRadius.lg,
  },
});
