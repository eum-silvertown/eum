import {useColorScheme} from 'react-native';

export const colors = {
  light: {
    text: {
      main: '#2E2559',
      primary: '#0268ED',
      secondary: '#666666',
      tertiary: '#999999',
      white: '#ffffff',
      error: '#ff0000',
      success: '#4CAF50',
      text01: '#242424',
      text02: '#555',
      text03: '#6F6F6F',
      text04: '#8B8B8B',
      readonly: '#ECECEC',
      placeholder: '#C1C1C1',
    },
    background: {
      content: '#F2F2FF',
      main: '#2E2559',
      mainPressed: '#001159',
      secondary: '#f5f5f5',
      primary: '#0268ED',
      primaryPress: '#0057B6',
      danger: '#DF1D1D',
      dangerPress: '#BC1A1A',
      cancle: '#EEEEEE',
      cancelPress: '#A5A5A5',
      readonly: '#ECECEC',
      white: '#FFFFFF',
      modalOverlay: '#00000080',
      input: '#F2F4F8',
    },
    borderColor: {
      cardBorder: '#463986',
      pickerBorder: '#DCDCDC',
    },
  },
  dark: {
    text: {
      main: '#2E2559',
      primary: '#0268ED',
      secondary: '#666666',
      tertiary: '#999999',
      white: '#ffffff',
      error: '#ff0000',
      success: '#4CAF50',
      text01: '#242424',
      text02: '#555',
      text03: '#6F6F6F',
      text04: '#8B8B8B',
      readonly: '#ECECEC',
      placeholder: '#C1C1C1',
    },
    background: {
      content: '#F9F9FB',
      main: '#2E2559',
      mainPressed: '#0057B6',
      secondary: '#f5f5f5',
      primary: '#0268ED',
      primaryPress: '#0057B6',
      danger: '#DF1D1D',
      dangerPress: '#BC1A1A',
      cancle: '#EEEEEE',
      cancelPress: '#A5A5A5',
      readonly: '#ECECEC',
      white: '#FFFFFF',
      modalOverlay: '#00000080',
      input: '#F2F4F8',
    },
    borderColor: {
      cardBorder: '#463986',
      pickerBorder: '#DCDCDC',
    },
  },
} as const;

type ThemeColors = typeof colors.light;
type ColorPath = {
  [K in keyof ThemeColors]: {
    [P in keyof ThemeColors[K]]: string;
  };
};

export function useColors(): ColorPath {
  const colorScheme = useColorScheme();
  const themeColors = colorScheme === 'dark' ? colors.dark : colors.light;

  return themeColors;
}

export type TextColorVariant = keyof typeof colors.light.text;
export type BackgroundColorVariant = keyof typeof colors.light.background;
