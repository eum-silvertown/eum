import {getResponsiveSize} from '@utils/responsive';

export const iconSize = {
  sm: getResponsiveSize(16),
  md: getResponsiveSize(20),
  lg: getResponsiveSize(24),
} as const;
