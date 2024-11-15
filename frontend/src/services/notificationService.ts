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
  createAt: string;
  updatedAt: string;
};

export async function getUnreadNotifications(): Promise<NotificationType[]> {
  try {
    const {data} = await authApiClient.get('notification');
    return data.data;
  } catch (error) {
    console.error('Failed to get UnreadNotifications: ', error);
    throw error;
  }
}
