import EncryptedStorage from 'react-native-encrypted-storage';

// 토큰 타입 설정
interface TokenData {
    accessToken: string;
    refreshToken: string;
  }

// 토큰 스토리지 저장
export const setToken = async (data: TokenData) => {
  try {
    await EncryptedStorage.setItem('authTokens', JSON.stringify({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    }));
  } catch (error) {
    console.error('Error saving tokens:', error);
  }
};

// 토큰 가져오기
export const getToken = async () => {
  try {
    const tokenData = await EncryptedStorage.getItem('authTokens');
    return tokenData ? JSON.parse(tokenData) : null;
  } catch (error) {
    console.error('Error retrieving tokens:', error);
    return null;
  }
};

// 토큰 삭제하기
export const clearToken = async () => {
  try {
    await EncryptedStorage.removeItem('authTokens');
  } catch (error) {
    console.error('Error clearing tokens:', error);
  }
};

// 자동 로그인 여부 저장
export const setAutoLogin = async (status: boolean) => {
  try {
    await EncryptedStorage.setItem('autoLogin', status ? 'true' : 'false');
  } catch (error) {
    console.error('Error saving auto-login status:', error);
  }
};

// 자동 로그인 여부 가져오기
export const getAutoLoginStatus = async () => {
  try {
    const status = await EncryptedStorage.getItem('autoLogin');
    return status === 'true';
  } catch (error) {
    console.error('Error retrieving auto-login status:', error);
    return false;
  }
};