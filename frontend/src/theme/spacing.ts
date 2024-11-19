import {getResponsiveSize} from '@utils/responsive';

export const spacing = {
  xs: getResponsiveSize(1.5),
  sm: getResponsiveSize(3),
  md: getResponsiveSize(6),
  lg: getResponsiveSize(10),
  xl: getResponsiveSize(18),
  xxl: getResponsiveSize(32),
} as const;
