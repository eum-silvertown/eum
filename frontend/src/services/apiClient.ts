import axios from 'axios';
import { getToken, clearToken } from '@utils/secureStorage';
import { refreshAuthToken } from '@services/authService';
import Config from 'react-native-config';
import { Alert } from 'react-native';
import { navigate } from '@services/NavigationService';
import { useAuthStore } from '@store/useAuthStore';

const { setIsLoggedIn } = useAuthStore.getState();

const baseURL = `${Config.BACKEND_API_URL}`;

const publicApiClient = axios.create({
  baseURL: baseURL,
});

const authApiClient = axios.create({
  baseURL: baseURL,
  timeout: 20000,
});

authApiClient.interceptors.request.use(async config => {
  const { accessToken } = await getToken();
  if (accessToken) {
    config.headers.Authorization = `${accessToken}`;
  }
  console.log("Request:", config.headers.Authorization); // 요청 정보 출력
  return config;
});

authApiClient.interceptors.response.use(
  response => {
    console.log("Response:", response.status, response.data); // 성공 응답 정보 출력
    return response;
  },
  async error => {
    if (error.response && error.response.status === 401) {
      console.log('에러 상태 출력', error.response.status, error.response.data);
      const errorCode = error.response.data.code;
      console.log('에러 코드:', errorCode);

      switch (errorCode) {
        case 'A003': // 유효하지 않은 JWT 토큰
        case 'A004': // Access Token 만료
        case 'A008': // Access Token 블랙리스트 등록
          try {
            const newAccessToken = await refreshAuthToken();
            error.config.headers.Authorization = `${newAccessToken}`;
            return authApiClient.request(error.config); // 원래 요청을 다시 보냄
          } catch (refreshError) {
            await handleLogoutAndRedirect(refreshError);
            return Promise.reject(refreshError);
          }

        case 'A005': // Refresh Token 만료
        case 'A006': // Refresh Token 블랙리스트 등록
        case 'A007': // Refresh Token을 찾을 수 없음
          await handleLogoutAndRedirect(error);
          return Promise.reject(new Error('세션이 만료되었습니다. 다시 로그인해주세요.'));

        case 'A001': // 인증 실패
        case 'A002': // JWT 토큰 없음
          Alert.alert('인증 실패', '다시 로그인해주세요.');
          navigate('LoginScreen'); // 로그인 페이지로 이동
          return Promise.reject(new Error('인증에 실패했습니다. 다시 로그인해주세요.'));

        default:
          return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

// 로그아웃 및 리디렉션 처리를 위한 공통 함수
async function handleLogoutAndRedirect(error: any) {
  await clearToken();
  setIsLoggedIn(false);
  Alert.alert('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
  navigate('LoginScreen'); // navigationRef를 통해 네비게이션 이동
}

export { publicApiClient, authApiClient };
