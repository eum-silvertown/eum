import {getResponsiveSize} from '@utils/responsive';

export const iconSize = {
  xxs: getResponsiveSize(6),
  xs: getResponsiveSize(8),
  sm: getResponsiveSize(10),
  md: getResponsiveSize(14),
  mdPlus: getResponsiveSize(16),
  lg: getResponsiveSize(20),
  xl: getResponsiveSize(32),
  xxl: getResponsiveSize(42),
} as const;
