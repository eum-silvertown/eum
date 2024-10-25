import {create} from 'zustand';
import * as Keychain from 'react-native-keychain';

interface AuthState {
  isLoggedIn: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  autoLogin: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  username: null,

  // 로그인 기능
  login: async (username: string, password: string): Promise<void> => {
    try {
      // 키체인에 로그인 정보 저장
      await Keychain.setGenericPassword(username, password);
      set({
        isLoggedIn: true,
        username,
      });
    } catch (error) {
      console.error('Failed to save login credentials', error);
    }
  },

  // 로그아웃 기능
  logout: async (): Promise<void> => {
    try {
      // 키체인에서 로그인 정보 삭제
      await Keychain.resetGenericPassword();
      set({
        isLoggedIn: false,
        username: null,
      });
    } catch (error) {
      console.error('Failed to reset login credentials', error);
    }
  },

  // 자동 로그인 기능
  autoLogin: async (): Promise<void> => {
    try {
      // 키체인에서 로그인 정보 불러오기
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        set({
          isLoggedIn: true,
          username: credentials.username,
        });
      }
    } catch (error) {
      console.error('Failed to load login credentials', error);
    }
  },
}));
