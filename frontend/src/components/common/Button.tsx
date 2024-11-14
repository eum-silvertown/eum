import {StyleProp, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import {Text} from './Text';
import {useColors} from 'src/hooks/useColors';
import {spacing} from '@theme/spacing';
import {borderRadius} from '@theme/borderRadius';
import {getResponsiveSize} from '@utils/responsive';

interface ButtonProps {
  style?: StyleProp<ViewStyle>;
  variant: 'pressable' | 'error';
  content: string;
  onPress?: () => void;
  size: 'sm' | 'md' | 'lg' | 'full';
}

function Button({
  style,
  content,
  size,
  onPress,
}: ButtonProps): React.JSX.Element {
  const colors = useColors();
  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      backgroundColor: colors.background.main,
      borderRadius: borderRadius.sm,
    },
  });
  const sizes = StyleSheet.create({
    sm: {
      width: 125,
    },
    md: {
      width: getResponsiveSize(128),
    },
    lg: {
      width: getResponsiveSize(160),
    },
    full: {
      width: '100%',
      height: 50,
    },
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, sizes[size], style]}>
      <Text color="white" align="center">
        {content}
      </Text>
    </TouchableOpacity>
  );
}

export default Button;
