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
