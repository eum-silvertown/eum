export const typography = {
  size: {
    caption: 15,
    body: 18,
    subtitle: 24,
    title: 32,
    xl: 40,
    xxl: 48,
  },
  weight: {
    regular: 'Pretendard-Regular',
    medium: 'Pretendard-Medium',
    bold: 'Pretendard-Bold',
  },
} as const;

export type SizeVarient = keyof typeof typography.size;
export type WeightVarient = keyof typeof typography.weight;
