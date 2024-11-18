import { Text } from '@components/common/Text';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useNotificationStore } from '@store/useNotificationStore';
import {
  deleteNotification,
  NotificationType,
  readNotification,
  readNotifications,
} from '@services/notificationService';
import Weather from '@components/main/widgets/Weather';
import { colors } from '@hooks/useColors';
import { useState } from 'react';
import { navigationRef } from '@services/NavigationService';
import { formatDateDiff } from '@utils/dateUtils';
import { useCurrentScreenStore } from '@store/useCurrentScreenStore';
import sidebarLogo from '@assets/images/sidebarLogo.png';

function NotificationScreen(): React.JSX.Element {
  const { width, height } = useWindowDimensions();
  const styles = getStyles(width, height);

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

  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const paginatedUnreadNotifications = unreadNotifications.slice(
    0,
    page * ITEMS_PER_PAGE,
  );
  const paginatedReadNotifications = notifications.slice(
    0,
    page * ITEMS_PER_PAGE,
  );

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

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

  const renderUnreadItem = ({ item: notification }: { item: NotificationType }) => (
    <Pressable style={styles.notification} onPress={() => {
      onPressRead(notification.id);
      switch (notification.type) {
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
      }
    }}>
      <View>
        <Text weight="bold">{notification.type}</Text>
      </View>
      <View style={{ width: '25%' }}>
        <Text>{notification.title}</Text>
      </View>
      <Text color="main" weight="medium">{notification.message}</Text>
      <View style={styles.notificationTail}>
        <Text variant="caption" color="secondary">
          {formatDateDiff(notification.createdAt)}
        </Text>
        <Pressable onPress={() => onPressRead(notification.id)}>
          <Text color="main">읽음</Text>
        </Pressable>
        <Pressable onPress={() => onPressDelete(notification.id)}>
          <Text color="error">삭제</Text>
        </Pressable>
      </View>
    </Pressable>
  );

  const renderReadItem = ({ item: notification }: { item: NotificationType }) => (
    <Pressable style={styles.notification}>
      <View>
        <Text weight="bold">{notification.type}</Text>
      </View>
      <View style={{ width: '25%' }}>
        <Text>{notification.title}</Text>
      </View>
      <View style={styles.notificationTail}>
        <Text variant="caption" color="secondary">
          {formatDateDiff(notification.createdAt)}
        </Text>
        <Pressable onPress={() => onPressDelete(notification.id)}>
          <Text color="error">삭제</Text>
        </Pressable>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Image source={sidebarLogo} style={{ position: 'absolute', right: '-30%', bottom: '-25%', width: '100%', height: '100%', objectFit: 'contain' }} />
      <View style={styles.leftContent}>
        <View style={styles.unreadSection}>
          <View style={styles.unreadHeader}>
            <Text variant="subtitle" weight="medium">
              안 읽은 알림{' '}
            </Text>
            <Text variant="subtitle" weight="medium">
              {unreadNotifications.length > 0 && unreadNotifications.length}
            </Text>
            <Pressable style={styles.readAllButton} onPress={onPressReadAll}>
              <Text>모두 읽음</Text>
            </Pressable>
          </View>
          <FlatList
            data={paginatedUnreadNotifications}
            renderItem={renderUnreadItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.notifications}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={5}
            initialNumToRender={10}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={true}
            bounces={false}
            ListEmptyComponent={
              <View style={styles.emptyNotification}>
                <Text>새로운 알림이 없습니다.</Text>
              </View>
            }
          />
        </View>
        <View style={styles.readSection}>
          <View>
            <Text variant="subtitle" weight="medium">
              지난 알림
            </Text>
          </View>
          <FlatList
            data={[...paginatedReadNotifications].reverse()}
            renderItem={renderReadItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.notifications}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={
              <View style={styles.emptyNotification}>
                <Text>알림이 없습니다.</Text>
              </View>
            }
          />
        </View>
      </View>
      <View style={styles.rightContent}>
        <View style={styles.widgets}>
          <View style={styles.widget}>
            <Weather />
          </View>
          <View style={styles.sidebarLogo}>

          </View>
        </View>
      </View>

    </View>
  );
}

export default NotificationScreen;

const getStyles = (width: number, height: number) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      gap: width * 0.01,
      padding: width * 0.015,
      backgroundColor: '#f0f0f0',
    },
    readAllButton: {
      marginLeft: 'auto',
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
      marginTop: width * 0.03,
      marginVertical: width * 0.01,
      paddingHorizontal: width * 0.005,
    },
    widget: {
      flex: 1,
      backgroundColor: 'white',
      borderRadius: width * 0.02,
      elevation: 3,
    },
    notifications: {
      width: '100%',
      flex: 1,
      marginVertical: width * 0.01,
      paddingHorizontal: width * 0.005,
      backgroundColor: 'white',
      borderWidth: width * 0.001,
      borderColor: colors.light.borderColor.pickerBorder,
      borderRadius: width * 0.01,
    },
    notification: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: width * 0.015,
      marginVertical: width * 0.005,
      paddingVertical: width * 0.02,
      paddingHorizontal: width * 0.02,
      backgroundColor: 'white',
      borderWidth: width * 0.001,
      borderColor: colors.light.borderColor.pickerBorder,
      borderRadius: width * 0.01,
    },
    notificationTail: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: width * 0.015,
      marginLeft: 'auto',
    },
    unreadSection: {
      flex: 1,
    },
    readSection: {
      flex: 1,
    },
    unreadHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      height: width * 0.02,
      paddingRight: width * 0.01,
    },
    emptyNotification: {
      marginTop: height * 0.2,
      margin: 'auto',
    },
    sidebarLogo: {
      flex: 1,
      zIndex: -1,
      left: -width * 0.15,
      top: -height * 0.2,
    },
  });
