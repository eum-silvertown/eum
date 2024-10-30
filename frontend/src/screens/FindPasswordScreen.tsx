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

type NavigationProps = NativeStackNavigationProp<ScreenType>;

function FindPasswordScreen(): React.JSX.Element {
  const navigation = useNavigation<NavigationProps>();
  const {setCurrentScreen} = useCurrentScreenStore();

  const {userId: initialUserId, email: initialEmail} =
    (useRoute().params as {userId?: string; email?: string} | undefined) || {};
  const [email, setEmail] = useState(initialEmail || '');
  const [userId, setUserId] = useState(initialUserId || '');
  const [verificationCode, setVerificationCode] = useState('');
  const [emailError, setEmailError] = useState('');
  const [userIdError, setUserIdError] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [temporaryPassword, setTemporaryPassword] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleEmailVerification = () => {
    let isValid = true;

    if (!email.includes('@')) {
      setEmailError('유효한 이메일 주소를 입력해주세요.');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!userId.trim()) {
      setUserIdError('아이디를 입력해주세요.');
      isValid = false;
    } else {
      setUserIdError('');
    }

    if (isValid) {
      console.log('인증번호가 전송되었습니다.');
    }
  };

  const handleVerifyCode = () => {
    // 테스트용
    if (verificationCode === '123456') {
      setTemporaryPassword('tempPassword123');
      setIsModalVisible(true);
      setVerificationError('');
    } else {
      setVerificationError('잘못된 인증번호입니다.');
    }
  };

  const moveLogin = () => {
    navigation.navigate("LoginScreen");
    setCurrentScreen("LoginScreen");
  };
  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="비밀번호 찾기" />

      <View style={styles.inputContainer}>
        <Text weight="bold">
          본인인증에 사용된 이메일과 아이디를 입력해주세요.
        </Text>

        <View style={styles.verificationCodeContainer}>
          <View>
            <Text>이메일</Text>
            <InputField
              placeholder="이메일을 입력해주세요."
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            {emailError && (
              <StatusMessage message={emailError} status="error" />
            )}
          </View>
          <View>
            <Text>아이디</Text>
            <InputField
              placeholder="아이디를 입력해주세요."
              value={userId}
              onChangeText={setUserId}
            />
            {userIdError && (
              <StatusMessage message={userIdError} status="error" />
            )}
          </View>
          <TouchableOpacity
            style={styles.verifyButton}
            onPress={handleEmailVerification}>
            <Text>인증번호 발송</Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text>인증번호</Text>
          <InputField
            placeholder="인증번호 6자리를 입력해주세요."
            value={verificationCode}
            onChangeText={setVerificationCode}
            maxLength={6}
            keyboardType="numeric"
          />
          {verificationError && (
            <StatusMessage message={verificationError} status="error" />
          )}
        </View>

        <TouchableOpacity
          style={styles.verifyButton}
          onPress={handleVerifyCode}>
          <Text>인증하기</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text weight="bold" style={styles.modalTitle} align="center">
              임시 비밀번호 발급이 완료되었습니다.{'\n'}
              이메일 확인 후 로그인 해주세요.
            </Text>

            <TouchableOpacity style={styles.closeButton} onPress={moveLogin}>
              <Text>로그인하러 가기</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  verificationCodeContainer: {
    gap: spacing.xl,
  },
  verifyButton: {
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    padding: spacing.lg,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  modalTitle: {
    marginBottom: spacing.md,
  },
  closeButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  moveScreenContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});
