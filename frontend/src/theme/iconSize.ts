import {getResponsiveSize} from '@utils/responsive';

export const iconSize = {
  xs: getResponsiveSize(12),
  sm: getResponsiveSize(16),
  md: getResponsiveSize(20),
  mdPlus: getResponsiveSize(24),
  lg: getResponsiveSize(32),
  xl: getResponsiveSize(48),
  xxl: getResponsiveSize(64),
} as const;
