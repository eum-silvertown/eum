import {getResponsiveSize} from '@utils/responsive';

export const typography = {
  size: {
    caption: getResponsiveSize(14),
    body: getResponsiveSize(16),
    subtitle: getResponsiveSize(20),
    title: getResponsiveSize(24),
    xl: getResponsiveSize(32),
    xxl: getResponsiveSize(36),
  },
  weight: {
    regular: 'Pretendard-Regular',
    medium: 'Pretendard-Medium',
    bold: 'Pretendard-Bold',
  },
} as const;

export type SizeVarient = keyof typeof typography.size;
export type WeightVarient = keyof typeof typography.weight;
