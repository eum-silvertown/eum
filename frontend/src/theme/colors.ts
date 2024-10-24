export const colors = {
  light: {
    text: {
      main: '#2E2559',
      primary: '#0268ED',
      secondary: '#666666',
      tertiary: '#999999',
      white: '#ffffff',
      error: '#ff0000',
      text01: '#242424',
      text02: '#555',
      text03: '#6F6F6F',
      text04: '#8B8B8B',
      readonly: '#ECECEC',
      placeholder: '#C1C1C1',
    },
    background: {
      main: '#2E2559',
      secondary: '#f5f5f5',
      primary: '#0268ED',
      primaryPress: '#0057B6',
      danger: '#DF1D1D',
      dangerPress: '#BC1A1A',
      cancle: '#EEEEEE',
      cancelPress: '#A5A5A5',
      readonly: '#ECECEC',
    },
    borderColor: {
      cardBorder: '#463986',
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
