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
    fontWeight: typography.weight.regular,
  },
  medium: {
    fontWeight: typography.weight.medium,
  },
  bold: {
    fontWeight: typography.weight.bold,
  },
});

const textColorsLight = StyleSheet.create({
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
});

const textColorsDark = StyleSheet.create({
  primary: {
    color: colors.dark.text.primary,
  },
  secondary: {
    color: colors.dark.text.secondary,
  },
  tertiary: {
    color: colors.dark.text.tertiary,
  },
  white: {
    color: colors.dark.text.white,
  },
  error: {
    color: colors.dark.text.error,
  },
});
