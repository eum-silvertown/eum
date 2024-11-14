import React, {useState} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {Text} from '@components/common/Text';
import ScreenHeader from '@components/account/ScreenHeader';
import InputField from '@components/account/InputField';
import {spacing} from '@theme/spacing';
import {colors} from 'src/hooks/useColors';
import {useRoute} from '@react-navigation/native';
import {useModal} from 'src/hooks/useModal';
import {
  requestEmailVerificationPassword,
  resetPasswordByVerificationCode,
} from '@services/authService';

import SuccessResetPasswordModal from '@components/account/SuccessResetPasswordModal';

function FindPasswordScreen(): React.JSX.Element {
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

  const [Isloading, setIsLoading] = useState(false);
  const [isVerifyLoading, setIsVerifyLoading] = useState(false);

  // 이메일과 아이디로 인증 코드 요청
  const handleSendVerification = async () => {
    setUserIdStatusText('');
    setEmailStatusText('');

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

    setIsLoading(true);
    try {
      const response = await requestEmailVerificationPassword(email, userId);
      setIsVerificationSent(true);
      setEmailStatusType('success');
      setUserIdStatusType('success');
      setEmailStatusText(response.message);
      setUserIdStatusText('');
      Alert.alert('이메일로 인증 코드를 발송하였습니다.');
    } catch (error) {
      setIsVerificationSent(false);
      setEmailStatusType('error');
      setUserIdStatusType('error');
      setEmailStatusText(String(error));
      setUserIdStatusText('');
    } finally {
      setIsLoading(false);
    }
  };

  // 인증 코드 확인 및 임시 비밀번호 발급
  const handleVerificationCodeInput = async () => {
    setVerificationCodeStatusText('');

    if (!verificationCode) {
      setVerificationCodeStatusType('error');
      setVerificationCodeStatusText('인증번호를 입력해주세요.');
      return;
    }
    setIsVerifyLoading(true);
    try {
      await resetPasswordByVerificationCode(
        email,
        verificationCode,
      );
      open(<SuccessResetPasswordModal />, {
        title: '임시 비밀번호 발급 완료',
      });
    } catch (error) {
      setVerificationCodeStatusType('error');
      setVerificationCodeStatusText(String(error));
    } finally {
      setIsVerifyLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="비밀번호 찾기" />

      <View style={styles.inputContainer}>
        <Text weight="bold">
          회원가입에 사용된 이메일과 아이디를 입력해주세요.
        </Text>

        <View style={{gap: spacing.md}}>
          <View style={{gap: spacing.md}}>
            <InputField
              label="아이디"
              placeholder="아이디를 입력해주세요."
              value={userId}
              onChangeText={setUserId}
              statusText={userIdStatusText}
              status={userIdStatusType}
              maxLength={20}
            />
            <InputField
              label="이메일"
              placeholder="이메일을 입력해주세요."
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              buttonText={Isloading ? '발송 중...' : '인증하기'}
              onButtonPress={handleSendVerification}
              statusText={emailStatusText}
              status={emailStatusType}
              maxLength={254}
            />
          </View>
          {/* 인증 코드 입력 필드 */}
          {isVerificationSent && (
            <InputField
              label="인증코드"
              placeholder="이메일로 받은 인증코드를 입력해주세요."
              value={verificationCode}
              onChangeText={setVerificationCode}
              buttonText={isVerifyLoading ? '인증 중...' : '본인인증'}
              onButtonPress={handleVerificationCodeInput}
              statusText={verificationCodeStatusText}
              status={verificationCodeStatusType}
              maxLength={8}
            />
          )}
        </View>
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
