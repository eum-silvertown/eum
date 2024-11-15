import {Text} from '@components/common/Text';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import CancelIcon from '@assets/icons/cancelIcon.svg';

function NotificationScreen(): React.JSX.Element {
  const {width} = useWindowDimensions();
  const styles = getStyles(width);

  return (
    <View style={styles.container}>
      <View style={styles.notifications}>
        <View>
          <Text variant="subtitle" weight="medium">
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
    </View>
  );
}

export default NotificationScreen;

const getStyles = (width: number) =>
  StyleSheet.create({
    container: {
      width: '100%',
      padding: width * 0.015,
      backgroundColor: 'white',
    },
    notifications: {
      width: '100%',
      height: '100%',
      gap: width * 0.01,
      borderRadius: width * 0.01,
    },
    notification: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: width * 0.015,
      paddingVertical: width * 0.015,
      paddingHorizontal: width * 0.02,
      backgroundColor: 'white',
      elevation: 1,
      borderRadius: width * 0.01,
    },
    icon: {
      width: width * 0.02,
      height: width * 0.02,
      borderRadius: 9999,
      backgroundColor: 'gray',
    },
    notificationTail: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: width * 0.01,
      marginLeft: 'auto',
    },
  });
