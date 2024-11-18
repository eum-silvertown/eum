import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardTypeOptions,
  ViewStyle,
} from 'react-native';
import { colors } from '@hooks/useColors';
import { borderWidth } from '@theme/borderWidth';
import { Text } from '@components/common/Text';
import StatusMessage from '@components/account/StatusMessage';
import { getResponsiveSize } from '@utils/responsive';

interface InputFieldProps {
  label?: string;
  value?: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  iconComponent?: React.ReactNode;
  onIconPress?: () => void;
  maxLength?: number;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  style?: ViewStyle;
  buttonText?: string;
  onButtonPress?: () => void;
  errorText?: string;
  statusText?: string | undefined;
  status?: 'error' | 'success' | 'info' | '';
}

function InputField({
  label,
  value,
  placeholder,
  onChangeText,
  secureTextEntry = false,
  iconComponent,
  onIconPress,
  maxLength,
  keyboardType = 'default',
  multiline = false,
  style,
  buttonText,
  onButtonPress,
  statusText,
  status,
}: InputFieldProps): React.JSX.Element {
  return (
    <View style={[styles.inputContainer, style]}>
      {label && (
        <Text variant="subtitle" weight="bold" style={styles.inputLabel}>
          {label}
        </Text>
      )}
      <View style={[styles.inputBox]}>
        <TextInput
          style={styles.inputField}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          maxLength={maxLength}
          keyboardType={keyboardType}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          autoCapitalize="none"
        />
        {iconComponent && (
          <TouchableOpacity style={styles.iconButton} onPress={onIconPress}>
            {iconComponent}
          </TouchableOpacity>
        )}
        {buttonText && onButtonPress && (
          <TouchableOpacity style={styles.smallButton} onPress={onButtonPress}>
            <Text weight="bold" color="white">
              {buttonText}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {statusText && <StatusMessage message={statusText} status={status} />}
    </View>
  );
}

export default InputField;

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
  },
  inputLabel: {
    marginBottom: 5,
  },
  inputBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputField: {
    flex: 1,
    height: getResponsiveSize(40),
    backgroundColor: '#f2f4f8',
    borderBottomWidth: borderWidth.sm,
    borderBottomColor: colors.light.borderColor.cardBorder,
    paddingHorizontal: 5,
    fontSize: getResponsiveSize(12),
  },
  iconButton: {
    position: 'absolute',
    right: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallButton: {
    backgroundColor: colors.light.background.main,
    paddingVertical: 3,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    width: '15%',
    height: '100%',
  },
});
