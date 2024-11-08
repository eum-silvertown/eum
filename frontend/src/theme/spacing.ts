import {getResponsiveSize} from '@utils/responsive';

export const spacing = {
  xs: getResponsiveSize(1),
  sm: getResponsiveSize(2),
  md: getResponsiveSize(4),
  lg: getResponsiveSize(7),
  xl: getResponsiveSize(11),
  xxl: getResponsiveSize(20),
} as const;
