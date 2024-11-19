export const typography = {
  size: {
    caption: 0.0075,
    body: 0.01,
    subtitle: 0.0125,
    title: 0.015,
    xl: 0.02,
    xxl: 0.025,
  },
  weight: {
    regular: 'Pretendard-Regular',
    medium: 'Pretendard-Medium',
    bold: 'Pretendard-Bold',
  },
} as const;

export type SizeVarient = keyof typeof typography.size;
export type WeightVarient = keyof typeof typography.weight;
