import {Dimensions} from 'react-native';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

// 갤럭시 S9 기준 (2960)
const STANDARD_WINDOW_WIDTH = 2960;

export function responsiveSize(size: number) {
  return (SCREEN_WIDTH / STANDARD_WINDOW_WIDTH) * size;
}

export function getResponsiveSize(size: number) {
  if (SCREEN_WIDTH > 600) {
    // 태블릿 등의 큰 화면에서의 scail
    return responsiveSize(size * 1.1);
  }
  return responsiveSize(size);
}
