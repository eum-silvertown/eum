import React from 'react';
import {View, TextInput, StyleSheet, TouchableOpacity, KeyboardTypeOptions } from 'react-native';
import {Text} from '@components/common/Text';
import {spacing} from '@theme/spacing';
import {colors} from 'src/hooks/useColors';
import { borderWidth } from '@theme/borderWidth';

interface InputFieldProps {  
  value?: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;  
  secureTextEntry?: boolean;
  showIcon?: boolean;
  iconComponent?: React.ReactNode;
  onIconPress?: () => void;
  maxLength?: number;
  keyboardType?: KeyboardTypeOptions;
}

function InputField({  
  value,
  placeholder,
  onChangeText,  
  secureTextEntry = false,
  showIcon = false,
  iconComponent,
  onIconPress,
  maxLength,
  keyboardType = 'default'
}: InputFieldProps): React.JSX.Element {
    return (                 
          <View style={styles.inputBox}>
            <TextInput
              style={styles.inputField}
              placeholder={placeholder}
              value={value}
              onChangeText={onChangeText}
              secureTextEntry={secureTextEntry}
              maxLength={maxLength}
              keyboardType={keyboardType}
            />                        
            {showIcon && iconComponent && (
              <TouchableOpacity style={styles.iconButton} onPress={onIconPress}>
                {iconComponent}
              </TouchableOpacity>
            )}
          </View>
      );
}

export default InputField;

const styles = StyleSheet.create({
    inputContainer: {
      width: '100%',
      marginBottom: spacing.md,
    },
    inputLabel: {     
      marginBottom: spacing.sm,
    },
    inputBox: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    inputField: {
      flex: 1,
      height: '100%',
      backgroundColor: '#f2f4f8',
      borderBottomWidth: borderWidth.sm,
      borderBottomColor: colors.light.borderColor.cardBorder,
      paddingHorizontal: spacing.sm,
    },
    iconButton: {
      position: 'absolute',
      right: spacing.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },    
  });
