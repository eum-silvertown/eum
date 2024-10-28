import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import {Text} from '@components/common/Text';
import { StyleSheet} from 'react-native';
import { spacing } from '@theme/spacing';
import BackArrowIcon from '@assets/icons/backArrowIcon.svg';

function SignUpSelectScreen(): React.JSX.Element {
    return (
        <View>

            <TouchableOpacity>
                <BackArrowIcon></BackArrowIcon>                     
            </TouchableOpacity>

            <Text>회원가입</Text>


        </View>
    )
}

export default SignUpSelectScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      justifyContent: 'center',
    },
    header: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    loginfield: {
      width: '50%',
      gap: spacing.xl, // 각 요소 간의 간격 설정
    },
    passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    passwordInput: {
      flex: 1,
    },
    iconButton: {
      padding: 8,
    },
    loginOptions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      alignItems: 'center',
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
      
    
    submitButtonText: {
      textAlign: 'center',
    },
    moveScreenButton: {
      alignItems: 'center',
    },
  });