export const colors = {
  light: {
    text: {
      primary: '#000000',
      secondary: '#666666',
      tertiary: '#999999',
      white: '#ffffff',
      error: '#ff0000',
    },
    background: {
      primary: '#ffffff',
      secondary: '#f5f5f5',
    },
  },
  dark: {
    text: {
      primary: '#FFFFFF',
      secondary: '#CCCCCC',
      tertiary: '#999999',
      white: '#000000',
      error: '#ff0000',
    },
    background: {
      primary: '#000000',
      secondary: '#666666',
    },
  },
} as const;

export type ColorVariant = keyof typeof colors.light.text;
