import axios from 'axios';
import {getToken, clearToken} from '@utils/secureStorage';
import {refreshAuthToken} from '../services/authService';
import Config from 'react-native-config';

const baseURL = `${Config.BACKEND_API_URL}`;
// 인증이 필요 없는 요청용 클라이언트
const publicApiClient = axios.create({
  baseURL: baseURL,
});

// 인증이 필요한 요청용 클라이언트
const authApiClient = axios.create({
  baseURL: baseURL,
});

// 요청 인터셉터
authApiClient.interceptors.request.use(async config => {
  const {accessToken} = await getToken();
  if (accessToken) {
    config.headers.Authorization = `${accessToken}`;
  }
  return config;
});

// 응답 인터셉터 - 401 응답이 올 경우
authApiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response && error.response.status === 401) {
      const errorCode = error.response.data.code;

      if (errorCode === 'A003') {
        // A003: 유효하지 않은 JWT 토큰, 액세스 토큰 갱신 시도
        try {
          const newAccessToken = await refreshAuthToken();
          error.config.headers.Authorization = `Bearer ${newAccessToken}`;
          return authApiClient.request(error.config);
        } catch (refreshError) {
          await clearToken();
          return Promise.reject(refreshError);
        }
      } else if (errorCode === 'A005' || errorCode === 'A006') {
        // A005, A006: 리프레시 토큰 만료 또는 블랙리스트 등록 - 로그아웃 처리
        await clearToken();
        // 필요시 로그인 페이지로 리다이렉트하거나 적절한 알림 표시
        return Promise.reject(
          new Error('로그인이 필요합니다. 다시 로그인해주세요.'),
        );
      }
    }
    return Promise.reject(error);
  },
);
export {publicApiClient, authApiClient};
