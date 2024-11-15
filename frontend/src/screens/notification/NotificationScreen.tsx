import {Text} from '@components/common/Text';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import {useNotificationStore} from '@store/useNotificationStore';
import {
  deleteNotification,
  readNotification,
  readNotifications,
} from '@services/notificationService';

function NotificationScreen(): React.JSX.Element {
  const {width, height} = useWindowDimensions();
  const styles = getStyles(width);

  const notifications = useNotificationStore(state => state.notifications);
  const unreadNotifications = useNotificationStore(
    state => state.unreadNotifications,
  );
  const updateNotifications = useNotificationStore(
    state => state.updateNotifications,
  );
  const readAllNotifications = useNotificationStore(
    state => state.readAllNotifications,
  );
  const updateDeleteNotification = useNotificationStore(
    state => state.updateDeleteNotification,
  );

  const onPressRead = async (notificationId: number) => {
    try {
      await readNotification(notificationId);
      updateNotifications(notificationId);
    } catch (error) {
      console.error('Failed to onPressRead: ', error);
    }
  };

  const onPressReadAll = async () => {
    try {
      const notificationIds = unreadNotifications.map(
        unreadNotification => unreadNotification.id,
      );
      await readNotifications(notificationIds);
      readAllNotifications();
    } catch (error) {
      console.error('Failed to onPressReadAll: ', error);
    }
  };

  const onPressDelete = async (notificationId: number) => {
    try {
      await deleteNotification(notificationId);
      updateDeleteNotification(notificationId);
    } catch (error) {
      console.error('Failed to onPressDelete: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingRight: width * 0.01,
          }}>
          <Text variant="subtitle" weight="medium">
            안 읽은 알림{' '}
            {unreadNotifications.length > 0 && unreadNotifications.length}
          </Text>
          <Pressable onPress={onPressReadAll}>
            <Text>모두 읽음</Text>
          </Pressable>
        </View>
        <ScrollView style={styles.notifications}>
          {unreadNotifications.length === 0 && (
            <View style={{marginTop: height * 0.2, margin: 'auto'}}>
              <Text>새로운 알림이 없습니다.</Text>
            </View>
          )}
          {unreadNotifications.map((notification, index) => (
            <View key={index} style={styles.notification}>
              <View style={styles.icon}></View>
              <View>
                <Text weight="bold">수업 알림</Text>
              </View>
              <View>
                <Text>{notification.title}</Text>
              </View>
              <View style={styles.notificationTail}>
                <Text variant="caption" color="secondary">
                  {notification.createdAt}
                </Text>
                <Pressable onPress={() => onPressRead(notification.id)}>
                  <Text color="main">읽음</Text>
                </Pressable>
                <Pressable onPress={() => onPressDelete(notification.id)}>
                  <Text color="error">삭제</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={{flex: 1}}>
        <View>
          <Text variant="subtitle" weight="medium">
            지난 알림
          </Text>
        </View>
        <ScrollView style={styles.notifications}>
          {notifications.length === 0 && (
            <View style={{marginTop: height * 0.2, margin: 'auto'}}>
              <Text>알림이 없습니다.</Text>
            </View>
          )}
          {notifications.map((notification, index) => (
            <View key={index} style={styles.notification}>
              <View style={styles.icon}></View>
              <View>
                <Text weight="bold">수업 알림</Text>
              </View>
              <View>
                <Text>{notification.title}</Text>
              </View>
              <View style={styles.notificationTail}>
                <Text variant="caption" color="secondary">
                  {notification.createdAt}
                </Text>
                <Pressable onPress={() => onPressDelete(notification.id)}>
                  <Text color="error">삭제</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

export default NotificationScreen;

const getStyles = (width: number) =>
  StyleSheet.create({
    container: {
      width: '100%',
      height: '100%',
      gap: width * 0.01,
      padding: width * 0.015,
      backgroundColor: 'white',
    },
    notifications: {
      width: '100%',
      flex: 1,
      marginVertical: width * 0.01,
      paddingHorizontal: width * 0.005,
      borderWidth: width * 0.0005,
      borderRadius: width * 0.01,
    },
    notification: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: width * 0.015,
      marginVertical: width * 0.005,
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
      gap: width * 0.015,
      marginLeft: 'auto',
    },
  });
