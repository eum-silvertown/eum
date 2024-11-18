import { useNotificationStore } from '@store/useNotificationStore';
import {
  deleteNotification,
  readNotification,
  readNotifications,
} from '@services/notificationService';
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useCurrentScreenStore } from '@store/useCurrentScreenStore';
import { useState } from 'react';
import { Text } from '@components/common/Text';
import { formatDateDiff } from '@utils/dateUtils';
import Weather from '@components/main/widgets/Weather';
import { colors } from '@hooks/useColors';
import DDay from '@components/notification/DDay';
import { navigationRef } from '@services/NavigationService';
import { Swipeable } from 'react-native-gesture-handler';

function NotificationScreen(): React.JSX.Element {
  const { width } = useWindowDimensions();
  const styles = getStyles(width);

  const { setCurrentScreen } = useCurrentScreenStore();
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

  const [tab, setTab] = useState<'unread' | 'read'>('unread');

  const renderRightActions = (notificationId: number, isUnread: boolean) => {
    return (
      <View style={{ flexDirection: 'row' }}>
        {isUnread && (
          <Pressable 
            style={[styles.swipeButton, { backgroundColor: colors.light.text.success }]}
            onPress={() => onPressRead(notificationId)}
          >
            <Text color="white">읽음</Text>
          </Pressable>
        )}
        <Pressable 
          style={[styles.swipeButton, { backgroundColor: '#FF5252' }]}
          onPress={() => onPressDelete(notificationId)}
        >
          <Text color="white">삭제</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <View style={styles.tabContainer}>
          <Pressable style={[{ flexDirection: 'row', gap: width * 0.005 }, tab === 'unread' ? styles.activeTab : styles.inactiveTab]} onPress={() => setTab('unread')}>
            <Text>새로운 알림</Text>
            <Text variant='body' weight='medium' color='main'>{unreadNotifications.length}</Text>
          </Pressable>
          <Pressable style={tab === 'read' ? styles.activeTab : styles.inactiveTab} onPress={() => setTab('read')}>
            <Text>지난 알림</Text>
          </Pressable>
        </View>
        <ScrollView style={styles.notificationList} contentContainerStyle={{ gap: width * 0.01 }}>
          {tab === 'unread' && unreadNotifications.length > 0 && <Pressable style={styles.readAllButton} onPress={onPressReadAll}><Text variant='body' weight='medium' color='main'>전체 읽음</Text></Pressable>}
          {tab === 'unread' && unreadNotifications.map(unreadNotification => (
            <Swipeable
              key={unreadNotification.id}
              renderRightActions={() => renderRightActions(unreadNotification.id, true)}
              overshootRight={false}
              rightThreshold={width * 0.1}
            >
              <Pressable style={styles.notification} onPress={() => {
                onPressRead(unreadNotification.id);
                switch (unreadNotification.type) {
                  case '수업 생성':
                  case '수업 시작':
                  case '시험 생성':
                    setCurrentScreen('ClassListScreen');
                    navigationRef.navigate('ClassListScreen');
                    break;
                  case '숙제 생성':
                    setCurrentScreen('HomeworkScreen');
                    navigationRef.navigate('HomeworkScreen');
                    break;
                  case '숙제 제출':
                    setCurrentScreen('ClassListScreen');
                    navigationRef.navigate('ClassListScreen');
                    break;
                }
              }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', padding: width * 0.005, backgroundColor: colors.light.background.main, borderRadius: 9999 }}>
                  <Text variant="body" weight="medium" color="white">{unreadNotification.type}</Text></View>
                <Text>{unreadNotification.title}</Text>
                <Text variant="body" color="secondary">{unreadNotification.message}</Text>
                <Text variant="caption" color="secondary" style={{ marginLeft: 'auto' }}>{formatDateDiff(unreadNotification.createdAt)}</Text>
              </Pressable>
            </Swipeable>
          ))}
          {tab === 'read' && notifications.map(notification => (
            <Swipeable
              key={notification.id}
              renderRightActions={() => renderRightActions(notification.id, false)}
              overshootRight={false}
              rightThreshold={width * 0.1}
            >
              <View style={styles.notification}>
                <View style={{ justifyContent: 'center', alignItems: 'center', padding: width * 0.005, backgroundColor: colors.light.background.main, borderRadius: 9999 }}>
                  <Text variant="body" weight="medium" color="white">{notification.type}</Text>
                </View>
                <Text>{notification.title}</Text>
                <Text variant="body" color="secondary">{notification.message}</Text>
                <Text variant="caption" color="secondary" style={{ marginLeft: 'auto' }}>{formatDateDiff(notification.createdAt)}</Text>
              </View>
            </Swipeable>
          ))}
        </ScrollView>
      </View>
      <View style={styles.rightContent}>
        <View style={styles.widgets}>
          <View style={styles.widget}>
            <Weather />
          </View>
          <View style={{ flex: 1 }}>
            <DDay />
          </View>
        </View>
      </View>
    </View>
  );
}

export default NotificationScreen;

const getStyles = (width: number) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      gap: width * 0.01,
      padding: width * 0.03,
      backgroundColor: '#f0f0f0',
    },
    leftContent: {
      flex: 7,
      height: '100%',
    },
    rightContent: {
      flex: 3,
      justifyContent: 'center',
      height: '100%',
    },
    widgets: {
      flex: 1,
      gap: width * 0.035,
      paddingHorizontal: width * 0.005,
    },
    widget: {
      flex: 1,
      backgroundColor: 'white',
      borderRadius: width * 0.02,
      elevation: 3,
    },
    tabContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    readAllButton: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    activeTab: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: width * 0.01,
      backgroundColor: 'white',
      borderTopLeftRadius: width * 0.01,
      borderTopRightRadius: width * 0.01,
      borderWidth: width * 0.001,
      borderBottomWidth: 0,
      borderColor: colors.light.borderColor.pickerBorder
    },
    inactiveTab: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: width * 0.01,
      backgroundColor: '#f0f0f0',
      borderTopLeftRadius: width * 0.01,
      borderTopRightRadius: width * 0.01,
      borderWidth: width * 0.001,
      borderBottomWidth: 0,
      borderColor: colors.light.borderColor.pickerBorder
    },
    notificationList: {
      backgroundColor: 'white',
      padding: width * 0.01,
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      borderBottomLeftRadius: width * 0.01,
      borderEndStartRadius: width * 0.01,
      borderLeftWidth: width * 0.001,
      borderRightWidth: width * 0.001,
      borderBottomWidth: width * 0.001,
      borderColor: colors.light.borderColor.pickerBorder,
    },
    notification: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: width * 0.015,
      paddingVertical: width * 0.01,
      paddingHorizontal: width * 0.015,
      borderWidth: width * 0.001,
      borderColor: colors.light.borderColor.pickerBorder,
      borderRadius: width * 0.01,
      backgroundColor: 'white',
    },
    swipeButton: {
      width: width * 0.05,
      justifyContent: 'center',
      alignItems: 'center',
      padding: width * 0.01,
      borderRadius: width * 0.01,
    },
  });