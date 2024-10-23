import {getResponsiveSize} from '@utils/responsive';

export const typography = {
  size: {
    caption: getResponsiveSize(13),
    body: getResponsiveSize(32),
    subtitle: getResponsiveSize(17),
    title: getResponsiveSize(48),
  },
  weight: {
    regular: 'Pretendard-Regular',
    medium: 'Pretendard-Medium',
    bold: 'Pretendard-Bold',
  },
} as const;

export type SizeVarient = keyof typeof typography.size;
export type WeightVarient = keyof typeof typography.weight;
