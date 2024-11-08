import {create} from 'zustand';

interface ClassInfo {
  school: string;
  grade: number;
  classNumber: number;
}

interface ImageInfo {
  image: string;
  url: string;
}

interface UserInfo {
  id: number;
  name: string;
  classInfo: ClassInfo;
  birth: string;
  image: ImageInfo | null;
  role: string;
}

interface AuthState {
  isLoggedIn: boolean;
  setIsLoggedIn: (status: boolean) => void;

  userInfo: UserInfo;
  setUserInfo: (info: UserInfo) => void;

  // 사이드바 온오프 여부
  sideBarVisible: boolean;
  setSideBarVisible: (status: boolean) => void;
}

// 초기값으로 사용할 빈 객체
const initialUserInfo: UserInfo = {
  id: 0,
  name: '',
  classInfo: {
    school: '',
    grade: 0,
    classNumber: 0,
  },
  birth: '',
  image: null,
  role: ''
};

export const useAuthStore = create<AuthState>(set => ({
  isLoggedIn: false,
  setIsLoggedIn: status => set({isLoggedIn: status}),
  userInfo: initialUserInfo,
  setUserInfo: info => set({userInfo: info}),
  sideBarVisible: false,
  setSideBarVisible: status => set({sideBarVisible: status}),
}));
