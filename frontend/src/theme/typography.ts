import {getResponsiveSize} from '@utils/responsive';

export const typography = {
  size: {
    caption: getResponsiveSize(8),
    body: getResponsiveSize(9),
    subtitle: getResponsiveSize(12),
    title: getResponsiveSize(16),
    xl: getResponsiveSize(20),
    xxl: getResponsiveSize(24),
  },
  weight: {
    regular: 'Pretendard-Regular',
    medium: 'Pretendard-Medium',
    bold: 'Pretendard-Bold',
  },
} as const;

export type SizeVarient = keyof typeof typography.size;
export type WeightVarient = keyof typeof typography.weight;
