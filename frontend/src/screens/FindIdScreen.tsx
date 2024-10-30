import React, {useState} from 'react';
import {Text} from '@components/common/Text';
import {StyleSheet, View, TouchableOpacity, Modal} from 'react-native';
import ScreenHeader from '@components/account/ScreenHeader';
import InputField from '@components/account/InputField';
import {spacing} from '@theme/spacing';
import {colors} from 'src/hooks/useColors';
import StatusMessage from '@components/account/StatusMessage';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScreenType, useCurrentScreenStore} from '@store/useCurrentScreenStore';

type NavigationProps = NativeStackNavigationProp<ScreenType>;

function FindIdScreen(): React.JSX.Element {
  const navigation = useNavigation<NavigationProps>();
  const {setCurrentScreen} = useCurrentScreenStore();

  const [userName, setuserName] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [foundId, setFoundId] = useState(''); // 찾은 아이디
  const [isModalVisible, setIsModalVisible] = useState(false);

  const moveFindPassword = (userId: string, email: string) => {
    navigation.navigate('FindPasswordScreen', {userId, email});
    setCurrentScreen('FindPasswordScreen');
  };
  const moveLogin = () => {
    navigation.navigate('LoginScreen');
    setCurrentScreen('LoginScreen');
  };

  const handleEmailVerification = () => {
    if (!email.includes('@')) {
      setErrorMessage('유효한 이메일 주소를 입력해주세요.');
      return false;
    } else {
      setErrorMessage('');
      return true;
    }
  };

  const handleFindId = () => {
    if (handleEmailVerification()) {
      const foundUserId = 'exampleUser123'; // 찾은 아이디라고 가정
      setFoundId(foundUserId);
      setIsModalVisible(true); // 모달을 열기
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="아이디 찾기" />

      <View style={styles.inputContainer}>
        <Text weight="bold">
          회원가입에 사용된 이름과 이메일을 입력해주세요.
        </Text>

        <View>
          <Text>이름</Text>
          <InputField
            placeholder="이름을 입력해주세요."
            value={userName}
            onChangeText={setuserName}
          />
        </View>
        <View>
          <Text>이메일</Text>
          <View style={styles.inputFieldContainer}>
            <View style={styles.inputField}>
              <InputField
                placeholder="이메일을 입력해주세요."
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>
          </View>
          {errorMessage && (
            <StatusMessage message={errorMessage} status="error" />
          )}
        </View>

        <TouchableOpacity style={{alignItems: 'center'}} onPress={handleFindId}>
          <Text>아이디 찾기</Text>
        </TouchableOpacity>
      </View>

      {/* 찾은 아이디를 표시하는 모달 */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text weight="bold" style={styles.modalTitle}>
              찾은 아이디
            </Text>
            <Text style={styles.modalId}>{foundId}</Text>

            <View style={styles.moveScreenContainer}>
              <TouchableOpacity
                onPress={() => moveFindPassword(foundId, email)}>
                <Text>비밀번호 찾기</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={moveLogin}>
                <Text>로그인 하러가기</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={closeModal}>
              <Text>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  inputFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  inputField: {
    flex: 1,
    width: '100%',
    height: '100%',
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
  modalId: {
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  moveScreenContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});
