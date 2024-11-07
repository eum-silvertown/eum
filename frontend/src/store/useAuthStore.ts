import {create} from 'zustand';

interface ClassInfo {
  school: string;
  grade: number;
  classNumber: number;
}

interface UserInfo {
  id: number;
  name: string;
  classInfo: ClassInfo;
  birth: string;
  image: string | null;
}

interface AuthState {
  isLoggedIn: boolean;
  setIsLoggedIn: (status: boolean) => void;
  
  username: string | null;
  setUsername: (username: string) => void;
  role: string | null;
  setRole: (role: string) => void;
  userProfileImage: string | null;
  setUserProfileImage: (image: string) => void;

  userInfo: UserInfo; 
  setUserInfo: (info: UserInfo) => void;
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
};

export const useAuthStore = create<AuthState>(set => ({
  isLoggedIn: false,
  setIsLoggedIn: status => set({isLoggedIn: status}),
  username: null,
  setUsername: username => set({username}),
  role: null,
  setRole: role => set({role}),
  userProfileImage: null,
  setUserProfileImage: image => set({userProfileImage: image}),
  userInfo: initialUserInfo,
  setUserInfo: info => set({userInfo: info}),
}));
