import {getResponsiveSize} from '@utils/responsive';

export const iconSize = {
  sm: getResponsiveSize(16),
  md: getResponsiveSize(20),
  lg: getResponsiveSize(32),
  xl: getResponsiveSize(48),
} as const;
