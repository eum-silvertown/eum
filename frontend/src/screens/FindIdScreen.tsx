import React, {useState, useEffect} from 'react';
import {Text} from '@components/common/Text';
import {StyleSheet, View} from 'react-native';
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

  // `foundId`가 설정되면 모달을
  useEffect(() => {
    if (foundId) {
      open(<FoundIdModal id={foundId} email={email} />, {
        title: '찾은 아이디',
      });
    }
  }, [foundId, email, open]);

  // 이메일로 인증코드 전송
  const handleSendVerification = async () => {
    if (!email || !email.includes('@')) {
      setEmailStatusText('유효한 이메일 주소를 입력해주세요.');
      setEmailStatusType('error');
      return;
    }
    try {
      const response = await requestEmailVerificationId(email);
      setIsVerificationSent(true);
      setEmailStatusType('success');
      setEmailStatusText(response.message);

      // 이메일 인증코드 발송 상태 변경
      setIsVerificationSent(true);
    } catch (error) {
      setIsVerificationSent(false);
      setEmailStatusType('error');
      setEmailStatusText(String(error));
    }
  };

  // 인증코드로 아이디 찾기
  const handleVerificationCodeInput = async () => {
    if (!verificationCode) {
      setVerificationCodeStatusType('error');
      setVerificationCodeStatusText('인증번호를 입력해주세요.');
    }
    try {
      const response = await findIdByVerificationCode(email, verificationCode);
      setFoundId(response);
    } catch (error) {
      setVerificationCodeStatusType('error');
      setVerificationCodeStatusText(String(error));
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="아이디 찾기" />

      <View style={styles.inputContainer}>
        <Text weight="bold">회원가입에 사용된 이메일을 입력해주세요.</Text>

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
        {/* 이메일 인증코드 입력 필드 */}
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
