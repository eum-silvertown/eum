import React, {useState} from 'react';
import {View, TouchableOpacity, Modal, StyleSheet} from 'react-native';
import {Text} from '@components/common/Text';
import ScreenHeader from '@components/account/ScreenHeader';
import InputField from '@components/account/InputField';
import {spacing} from '@theme/spacing';
import {colors} from 'src/hooks/useColors';
import StatusMessage from '@components/account/StatusMessage';
import {useRoute} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScreenType, useCurrentScreenStore} from '@store/useCurrentScreenStore';
import {useModal} from 'src/hooks/useModal';
import {
  requestEmailVerificationPassword,
  resetPasswordByVerificationCode,
} from '@services/authService';

import SuccessResetPasswordModal from '@components/account/SuccessResetPasswordModal';

type NavigationProps = NativeStackNavigationProp<ScreenType>;

function FindPasswordScreen(): React.JSX.Element {
  const navigation = useNavigation<NavigationProps>();
  const {setCurrentScreen} = useCurrentScreenStore();

  const {userId: initialUserId, email: initialEmail} =
    (useRoute().params as {userId?: string; email?: string} | undefined) || {};
  const {open} = useModal();

  const [email, setEmail] = useState(initialEmail || '');
  const [userId, setUserId] = useState(initialUserId || '');
  const [verificationCode, setVerificationCode] = useState('');
  const [emailStatusText, setEmailStatusText] = useState('');
  const [emailStatusType, setEmailStatusType] = useState<
    'success' | 'error' | 'info' | ''
  >('info');
  const [userIdStatusText, setUserIdStatusText] = useState('');
  const [userIdStatusType, setUserIdStatusType] = useState<
    'success' | 'error' | 'info' | ''
  >('info');
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [verificationCodeStatusText, setVerificationCodeStatusText] =
    useState('');
  const [verificationCodeStatusType, setVerificationCodeStatusType] = useState<
    'success' | 'error' | 'info' | ''
  >('info');

  // 이메일과 아이디로 인증 코드 요청
  const handleSendVerification = async () => {
    if (!email || !email.includes('@')) {
      setEmailStatusText('유효한 이메일 주소를 입력해주세요.');
      setEmailStatusType('error');
      return;
    }
    if (!userId.trim()) {
      setUserIdStatusText('아이디를 입력해주세요.');
      setUserIdStatusType('error');
      return;
    }
    try {
      const response = await requestEmailVerificationPassword(email, userId);
      setIsVerificationSent(true);
      setEmailStatusType('success');
      setUserIdStatusType('success');
      setEmailStatusText(response.message);
      setUserIdStatusText('');
    } catch (error) {
      setIsVerificationSent(false);
      setEmailStatusType('error');
      setUserIdStatusType('error');
      setEmailStatusText(String(error));
      setUserIdStatusText('');
    }
  };

  // 인증 코드 확인 및 임시 비밀번호 발급
  const handleVerificationCodeInput = async () => {
    if (!verificationCode) {
      setVerificationCodeStatusType('error');
      setVerificationCodeStatusText('인증번호를 입력해주세요.');
      return;
    }
    try {
      const response = await resetPasswordByVerificationCode(
        email,
        verificationCode,
      );
      open(<SuccessResetPasswordModal />, {
        title: '임시 비밀번호 발급 완료',
      });
    } catch (error) {
      setVerificationCodeStatusType('error');
      setVerificationCodeStatusText(String(error));
    }
  };  

  return (
    <View style={styles.container}>
      <ScreenHeader title="비밀번호 찾기" />

      <View style={styles.inputContainer}>
        <Text weight="bold">
          회원가입에 사용된 이메일과 아이디를 입력해주세요.
        </Text>

        <View>
          <InputField
            label="아이디"
            placeholder="아이디를 입력해주세요."
            value={userId}
            onChangeText={setUserId}
            statusText={userIdStatusText}
            status={userIdStatusType}
          />
          <InputField
            label="이메일"
            placeholder="이메일을 입력해주세요."
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            buttonText="인증하기"
            onButtonPress={handleSendVerification}
            statusText={emailStatusText}
            status={emailStatusType}
          />
        </View>

        {/* 인증 코드 입력 필드 */}
        {isVerificationSent && (
          <InputField
            label="인증번호"
            placeholder="이메일로 받은 인증코드를 입력해주세요."
            value={verificationCode}
            onChangeText={setVerificationCode}
            buttonText="인증하기"
            onButtonPress={handleVerificationCodeInput}
            statusText={verificationCodeStatusText}
            status={verificationCodeStatusType}
          />
        )}
      </View>
    </View>
  );
}

export default FindPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '40%',
    gap: spacing.xl,
  },
});
