import {getResponsiveSize} from '@utils/responsive';

export const iconSize = {
  xxs: getResponsiveSize(9),
  xs: getResponsiveSize(12),
  sm: getResponsiveSize(16),
  md: getResponsiveSize(22),
  mdPlus: getResponsiveSize(25),
  lg: getResponsiveSize(32),
  xl: getResponsiveSize(50),
  xxl: getResponsiveSize(67),
} as const;
