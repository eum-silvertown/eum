import {Text} from '@components/common/Text';
import {StyleSheet, View} from 'react-native';
import CancelIcon from '@assets/icons/cancelIcon.svg';

function NotificationScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
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
                <CancelIcon width={20} height={20} />
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
    paddingVertical: 25,
    paddingHorizontal: 40,
    backgroundColor: 'white',
  },
  contentContainer: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    gap: 25,
  },
  notifications: {
    width: '75%',
    height: '100%',
    gap: 15,
    padding: 15,
    backgroundColor: 'white',
    elevation: 2,
    borderRadius: 15,
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '10%',
    gap: 25,
    paddingVertical: 15,
    paddingHorizontal: 25,
    backgroundColor: 'white',
    elevation: 1,
    borderRadius: 10,
  },
  icon: {
    width: 30,
    height: 30,
    borderRadius: 9999,
    backgroundColor: 'gray',
  },
  notificationTail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginLeft: 'auto',
  },
  buttons: {flex: 1, gap: 15},
  button: {
    flex: 1,
    padding: 15,
    backgroundColor: 'white',
    elevation: 2,
    borderRadius: 15,
  },
});
