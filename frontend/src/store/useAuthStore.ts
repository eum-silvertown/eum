import {create} from 'zustand';
import * as Keychain from 'react-native-keychain';

interface AuthState {
  isLoggedIn: boolean;
  setIsLoggedIn: (status: boolean) => void;
  username: string | null;
  role: string | null;  
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  setIsLoggedIn: (status) => set({ isLoggedIn: status }),
  username: '',
  role: '',
}));
