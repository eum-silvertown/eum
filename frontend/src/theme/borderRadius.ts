import {getResponsiveSize} from '@utils/responsive';

export const borderRadius = {
  sm: getResponsiveSize(4),
  md: getResponsiveSize(8),
  lg: getResponsiveSize(12),
  xl: getResponsiveSize(16),
  xxl: getResponsiveSize(20),
} as const;
