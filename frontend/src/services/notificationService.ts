import {authApiClient} from './apiClient';

export async function saveFCMToken(fcmToken: string) {
  try {
    const {data} = await authApiClient.post('notification', {
      token: fcmToken,
    });
    console.log(data);
  } catch (error) {
    console.error('Failed to saveFCMToken: ', error);
  }
}

export async function removeFCMToken() {
  try {
    const {data} = await authApiClient.delete('notification');
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

export type NotificationType = {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  type: string;
};

export async function getUnreadNotifications(): Promise<NotificationType[]> {
  try {
    const {data} = await authApiClient.get('notification');
    console.log('UnreadNotifications 조회 성공: ', data);
    return data.data;
  } catch (error) {
    console.error('Failed to get UnreadNotifications: ', error);
    throw error;
  }
}

export async function getReadNotifications(): Promise<NotificationType[]> {
  try {
    const {data} = await authApiClient.get('notification/read');
    return data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function readNotification(notificationId: number) {
  try {
    await authApiClient.post('notification', {notificationId});
  } catch (error) {
    console.error('Failed to read Notification');
    throw error;
  }
}

export async function readNotifications(notificationIds: number[]) {
  try {
    console.log(notificationIds);
    await authApiClient.post('notification/read', {
      notificationIds,
    });
  } catch (error) {
    console.error('Failed to read Notifications');
    throw error;
  }
}

export async function deleteNotification(notificationId: number) {
  try {
    const {data} = await authApiClient.delete(`notification/${notificationId}`);
    console.log('Delete Notification: ', data);
  } catch (error) {
    console.error('Failed to delete Notification: ', error);
    throw error;
  }
}
