import {StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from './Text';
import {useColors} from 'src/hooks/useColors';
import {spacing} from '@theme/spacing';
import {borderRadius} from '@theme/borderRadius';
import {getResponsiveSize} from '@utils/responsive';

interface ButtonProps {
  variant: 'pressable' | 'error';
  content: string;
  size: 'sm' | 'md' | 'lg' | 'full';
}

function Button({content, size}: ButtonProps): React.JSX.Element {
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
      width: getResponsiveSize(100),
    },
    md: {
      width: getResponsiveSize(125),
    },
    lg: {
      width: getResponsiveSize(150),
    },
    full: {
      width: '100%',
      height: getResponsiveSize(40),
    },
  });

  return (
    <TouchableOpacity style={[styles.container, sizes[size]]}>
      <Text color="white" align="center">
        {content}
      </Text>
    </TouchableOpacity>
  );
}

export default Button;
