import {getResponsiveSize} from '@utils/responsive';

export const borderRadius = {
  sm: getResponsiveSize(3),
  md: getResponsiveSize(6),
  lg: getResponsiveSize(9),
  xl: getResponsiveSize(12),
  xxl: getResponsiveSize(15),
} as const;
