import React, {useState, useEffect} from 'react';
import {Text} from '@components/common/Text';
import {StyleSheet, View, Alert} from 'react-native';
import ScreenHeader from '@components/account/ScreenHeader';
import InputField from '@components/account/InputField';
import {spacing} from '@theme/spacing';
import {colors} from 'src/hooks/useColors';
import {useModal} from 'src/hooks/useModal';
import FoundIdModal from '@components/account/FoundIdModal';

import {
  requestEmailVerificationId,
  findIdByVerificationCode,
} from '@services/authService';

function FindIdScreen(): React.JSX.Element {
  const {open} = useModal();

  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [foundId, setFoundId] = useState('');
  const [emailStatusText, setEmailStatusText] = useState('');
  const [emailStatusType, setEmailStatusType] = useState<
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
  useEffect(() => {
    if (foundId) {
      open(<FoundIdModal id={foundId} email={email} />, {
        title: '찾은 아이디',
      });
    }
  }, [foundId, email, open]);

  // 이메일로 인증코드 전송
  const handleSendVerification = async () => {
    setEmailStatusText('');

    if (!email || !email.includes('@')) {
      setEmailStatusText('유효한 이메일 주소를 입력해주세요.');
      setEmailStatusType('error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await requestEmailVerificationId(email);
      setIsVerificationSent(true);
      setEmailStatusType('success');
      setEmailStatusText(response.message);
      Alert.alert('이메일로 인증 코드를 발송하였습니다.');
      // 이메일 인증코드 발송 상태 변경
      setIsVerificationSent(true);
    } catch (error) {
      setIsVerificationSent(false);
      setEmailStatusType('error');
      setEmailStatusText(String(error));
    } finally {
      setIsLoading(false);
    }
  };

  // 인증코드로 아이디 찾기
  const handleVerificationCodeInput = async () => {
    setVerificationCodeStatusText('');

    if (!verificationCode) {
      setVerificationCodeStatusType('error');
      setVerificationCodeStatusText('인증코드를 입력해주세요.');
      return;
    }
    setIsVerifyLoading(true);
    try {
      const response = await findIdByVerificationCode(email, verificationCode);
      setFoundId(response);
    } catch (error) {
      setVerificationCodeStatusType('error');
      setVerificationCodeStatusText(String(error));
    } finally {
      setIsVerifyLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="아이디 찾기" />

      <View style={styles.inputContainer}>
        <Text weight="bold">회원가입에 사용된 이메일을 입력해주세요.</Text>

        <View style={{gap: spacing.md}}>
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
          {/* 이메일 인증코드 입력 필드 */}
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

export default FindIdScreen;

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
