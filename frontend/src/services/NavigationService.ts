// React Navigation을 컴포넌트 외부에서 사용하기 위한 설정 파일
import { createNavigationContainerRef, ParamListBase } from '@react-navigation/native';

// navigationRef: 전역에서 접근 가능한 네비게이션 참조 객체
export const navigationRef = createNavigationContainerRef<ParamListBase>();

// navigationRef가 준비된 경우에만 navigate 메서드를 호출하여 화면 이동을 처리합니다.
export function navigate(name: string, params?: object) {
  if (navigationRef.isReady()) {
    // name: 이동할 스크린 이름 (string 타입)
    // params: 스크린에 전달할 파라미터 (object 타입)
    navigationRef.navigate(name, params);
  }
}