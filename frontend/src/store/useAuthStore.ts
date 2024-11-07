import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  setIsLoggedIn: (status: boolean) => void;
  username: string | null;
  setUsername: (username: string) => void;
  role: string | null;
  setRole: (role: string) => void;
  userProfileImage: string | null;
  setUserProfileImage: (image: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  setIsLoggedIn: (status) => set({ isLoggedIn: status }),
  username: null,
  setUsername: (username) => set({ username }),
  role: null,
  setRole: (role) => set({ role }),
  userProfileImage: null,
  setUserProfileImage: (image) => set({ userProfileImage: image }),
}));
