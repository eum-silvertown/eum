import {getResponsiveSize} from '@utils/responsive';

export const spacing = {
  xs: getResponsiveSize(4),
  sm: getResponsiveSize(8),
  md: getResponsiveSize(16),
  lg: getResponsiveSize(32),
  xl: getResponsiveSize(48),
} as const;
