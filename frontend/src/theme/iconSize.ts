import {getResponsiveSize} from '@utils/responsive';

export const iconSize = {
  sm: getResponsiveSize(24),
  md: getResponsiveSize(28),
  lg: getResponsiveSize(32),
} as const;
