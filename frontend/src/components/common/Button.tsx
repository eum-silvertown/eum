import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  ViewStyle,
} from 'react-native';
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
  const {width} = useWindowDimensions();
  const colors = useColors();
  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      paddingVertical: width * 0.0075,
      paddingHorizontal: width * 0.01,
      backgroundColor: colors.background.main,
      borderRadius: width * 0.005,
    },
  });
  const sizes = StyleSheet.create({
    sm: {
      width: width * 0.08,
    },
    md: {
      width: width * 0.1,
    },
    lg: {
      width: width * 0.12,
    },
    full: {
      width: '100%',
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
