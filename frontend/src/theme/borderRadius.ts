import {getResponsiveSize} from '@utils/responsive';

export const borderRadius = {
  sm: getResponsiveSize(4),
  md: getResponsiveSize(8),
  lg: getResponsiveSize(12),
  xl: getResponsiveSize(18),
  xxl: getResponsiveSize(24),
} as const;
