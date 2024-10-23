export const typography = {
  size: {
    caption: 13,
    body: 32,
    subtitle: 17,
    title: 48,
  },
  weight: {
    regular: '400',
    medium: '500',
    bold: '700',
  },
} as const;

export type SizeVarient = keyof typeof typography.size;
export type WeightVarient = keyof typeof typography.weight;
