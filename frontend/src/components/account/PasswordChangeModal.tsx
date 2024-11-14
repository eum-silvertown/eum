import {StyleSheet, View, TouchableOpacity, Alert} from 'react-native';
import React, {useState, useEffect} from 'react';
import InputField from './InputField';
import PasswordVisibleIcon from '@assets/icons/passwordVisibleIcon.svg';
import PasswordVisibleOffIcon from '@assets/icons/passwordVisibleOffIcon.svg';
import {iconSize} from '@theme/iconSize';
import {Text} from '@components/common/Text';
import {borderRadius} from '@theme/borderRadius';
import {colors} from 'src/hooks/useColors';
import {changePassword, logOut} from '@services/authService';
import {useModalContext} from 'src/contexts/useModalContext';

import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScreenType, useCurrentScreenStore} from '@store/useCurrentScreenStore';

type NavigationProps = NativeStackNavigationProp<ScreenType>;

export default function PasswordChangeModal(): React.JSX.Element {
  const navigation = useNavigation<NavigationProps>();
  const {setCurrentScreen} = useCurrentScreenStore();
  const [password, setPassword] = useState('');
  const {close} = useModalContext();
  const [confirmPassword, setConfirmPassword] = useState('');

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordStatusText, setPasswrodStatusText] = useState('');
  const [passwordStatusType, setPasswordStatusType] = useState<
    'success' | 'error' | 'info' | ''
  >('info');

  const [confirmPasswordStatusText, setConfirmPasswordStatusText] =
    useState('');
  const [confirmPasswordStatusType, setConfirmPasswordStatusType] = useState<
    'success' | 'error' | 'info' | ''
  >('info');

  const handlePasswordChange = async () => {
    setPasswrodStatusText('');
    setConfirmPasswordStatusText('');
    let isValid = true;

    // 유효성 검사 확인
    if (!password) {
      setPasswordStatusType('error');
      setPasswrodStatusText('비밀번호를 입력해주세요.');
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordStatusType('error');
      setConfirmPasswordStatusText('비밀번호를 입력해주세요.');
      isValid = false;
    }

    if (password !== confirmPassword) {
      isValid = false;
      setConfirmPasswordStatusText('비밀번호가 일치하지 않습니다.');
    }

    // 유효성 검사 통과 여부 확인
    if (!isValid) {
      return; // 유효성 검사 실패 시 함수 종료
    }

    try {
      await changePassword(password);
      Alert.alert(
        '비밀번호가 성공적으로 변경되었습니다. 다시 로그인해 주세요.',
      );

      await logOut();
      navigation.reset({
        index: 0,
        routes: [{name: 'LoginScreen'}],
      });
      setCurrentScreen('LoginScreen');

      close();
    } catch (error) {
      console.log('비밀번호 변경 실패', error);
      Alert.alert('비밀번호 변경에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  // 비밀번호 확인 체크 로직
  useEffect(() => {
    if (confirmPassword) {
      if (password !== confirmPassword) {
        setConfirmPasswordStatusText('비밀번호가 일치하지 않습니다.');
        setConfirmPasswordStatusType('error');
      } else {
        setConfirmPasswordStatusText('비밀번호가 일치합니다.');
        setConfirmPasswordStatusType('success');
      }
    } else {
      setConfirmPasswordStatusText('');
      setConfirmPasswordStatusType('info');
    }
  }, [password, confirmPassword]);

  return (
    <View style={styles.container}>
      {/* 비밀번호 입력 필드 */}
      <InputField
        label="비밀번호"
        placeholder="변경하실 비밀번호를 입력해주세요."
        value={password}
        secureTextEntry={!passwordVisible}
        onChangeText={setPassword}
        statusText={passwordStatusText}
        status={passwordStatusType}
        iconComponent={
          passwordVisible ? (
            <PasswordVisibleIcon width={iconSize.md} height={iconSize.md} />
          ) : (
            <PasswordVisibleOffIcon width={iconSize.md} height={iconSize.md} />
          )
        }
        onIconPress={() => setPasswordVisible(!passwordVisible)}
        maxLength={64}
      />

      {/* 비밀번호 확인 입력 필드 */}
      <InputField
        label="비밀번호 확인"
        placeholder="변경하실 비밀번호를 한번 더 입력해주세요."
        value={confirmPassword}
        secureTextEntry={!passwordVisible}
        onChangeText={setConfirmPassword}
        statusText={confirmPasswordStatusText}
        status={confirmPasswordStatusType}
        maxLength={64}
      />
      <TouchableOpacity style={styles.button} onPress={handlePasswordChange}>
        <Text color="white" weight="bold">
          변경하기
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    gap: 15,
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.light.background.main,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: borderRadius.sm,
  },
});
