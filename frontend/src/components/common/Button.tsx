import {StyleProp, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import {Text} from './Text';
import {useColors} from 'src/hooks/useColors';

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
      paddingVertical: 10,
      paddingHorizontal: 15,
      backgroundColor: colors.background.main,
      borderRadius: 5,
    },
  });
  const sizes = StyleSheet.create({
    sm: {
      width: 125,
    },
    md: {
      width: 172,
    },
    lg: {
      width: 216,
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
