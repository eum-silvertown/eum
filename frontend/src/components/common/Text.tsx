import {
  StyleSheet,
  Text as RNText,
  TextProps,
  useColorScheme,
} from 'react-native';
import {typography, SizeVarient, WeightVarient} from '@theme/typography';
import {colors, ColorVariant} from '@theme/colors';

interface CustomTextProps extends TextProps {
  variant?: SizeVarient;
  color?: ColorVariant;
  weight?: WeightVarient;
  children: React.ReactNode;
}

export function Text({
  variant = 'body',
  color = 'primary',
  weight = 'regular',
  style,
  children,
  ...props
}: CustomTextProps) {
  const colorScheme = useColorScheme();
  const themeColors = colorScheme === 'dark' ? textColorsDark : textColorsLight;

  return (
    <RNText
      style={[
        fontSizes[variant],
        themeColors[color],
        fontWeights[weight],
        style,
      ]}
      {...props}>
      {children}
    </RNText>
  );
}

const fontSizes = StyleSheet.create({
  title: {
    fontSize: typography.size.title,
  },
  subtitle: {
    fontSize: typography.size.subtitle,
  },
  body: {
    fontSize: typography.size.body,
  },
  caption: {
    fontSize: typography.size.caption,
  },
});

const fontWeights = StyleSheet.create({
  regular: {
    fontFamily: typography.weight.regular,
  },
  medium: {
    fontFamily: typography.weight.medium,
  },
  bold: {
    fontFamily: typography.weight.bold,
  },
});

const textColorsLight = StyleSheet.create({
  main: {
    color: colors.light.text.main,
  },
  primary: {
    color: colors.light.text.primary,
  },
  secondary: {
    color: colors.light.text.secondary,
  },
  tertiary: {
    color: colors.light.text.tertiary,
  },
  white: {
    color: colors.light.text.white,
  },
  error: {
    color: colors.light.text.error,
  },
  text01: {
    color: colors.light.text.text01,
  },
  text02: {
    color: colors.light.text.text02,
  },
  text03: {
    color: colors.light.text.text03,
  },
  text04: {
    color: colors.light.text.text04,
  },
  readonly: {
    color: colors.light.text.readonly,
  },
  placeholder: {
    color: colors.light.text.placeholder,
  },
});

const textColorsDark = StyleSheet.create({
  main: {
    color: colors.light.text.main,
  },
  primary: {
    color: colors.light.text.primary,
  },
  secondary: {
    color: colors.light.text.secondary,
  },
  tertiary: {
    color: colors.light.text.tertiary,
  },
  white: {
    color: colors.light.text.white,
  },
  error: {
    color: colors.light.text.error,
  },
  text01: {
    color: colors.light.text.text01,
  },
  text02: {
    color: colors.light.text.text02,
  },
  text03: {
    color: colors.light.text.text03,
  },
  text04: {
    color: colors.light.text.text04,
  },
  readonly: {
    color: colors.light.text.readonly,
  },
  placeholder: {
    color: colors.light.text.placeholder,
  },
});
