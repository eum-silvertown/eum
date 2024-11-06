import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Text} from '@components/common/Text';
import {spacing} from '@theme/spacing';
import {colors} from 'src/hooks/useColors';
import {useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScreenType, useCurrentScreenStore} from '@store/useCurrentScreenStore';

import SearchIcon from '@assets/icons/searchIcon.svg';
import PasswordVisibleIcon from '@assets/icons/passwordVisibleIcon.svg';
import PasswordVisibleOffIcon from '@assets/icons/passwordVisibleOffIcon.svg';

import {iconSize} from '@theme/iconSize';

import ScreenHeader from '@components/account/ScreenHeader';
import InputField from '@components/account/InputField';
import SearchSchoolModal from '@components/account/SearchSchoolModal';
import {useModal} from 'src/hooks/useModal';
import {getResponsiveSize} from '@utils/responsive';

type NavigationProps = NativeStackNavigationProp<ScreenType>;

function SignUpScreen(): React.JSX.Element {
  const {open} = useModal();
  const navigation = useNavigation<NavigationProps>();
  const {userType} = useRoute().params as {userType: 'teacher' | 'student'};
  const headerText =
    userType === 'teacher' ? '선생님으로 가입하기' : '학생으로 가입하기';

  // 회원가입 정보 상태
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [school, setSchool] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('0');
  const [selectedClass, setSelectedClass] = useState('0');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  // 유효성 검사 상태
  const [userIdError, setUserIdError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [varificationCodeError, setVerificationCodeError] = useState('');
  const [nameError, setNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [schoolError, setSchoolError] = useState('');
  const [birthError, setBirthError] = useState('');
  const [genderError, setGenderError] = useState('');

  const validateFields = () => {
    let isValid = true;

    if (!userId) {
      setUserIdError('아이디를 입력해주세요.');
      isValid = false;
    } else {
      setUserIdError('');
    }

    if (!email.includes('@')) {
      setEmailError('유효한 이메일 주소를 입력해주세요.');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!name) {
      setNameError('이름을 입력해주세요.');
      isValid = false;
    } else {
      setNameError('');
    }

    if (password.length < 6) {
      setPasswordError('비밀번호를 입력해주세요.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    return isValid;
  };
  // 비밀번호 확인 체크 로직
  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
    } else {
      setConfirmPasswordError('');
    }
  }, [password, confirmPassword]);

  const handleDuplicateCheck = () => {
    console.log('아이디 중복 확인:', userId);
    Alert.alert('아이디 중복 확인');
  };

  const handleSendVerification = () => {
    console.log('인증 이메일 전송:', email);
    Alert.alert(email + '인증번호를 전송하였습니다.');
    setIsVerificationSent(true);
  };

  const handleVerificationCodeInput = () => {
    console.log('인증번호로 인증하기', verificationCode);
  };

  const handleDateChange = (text: string) => {
    // 숫자만 입력 받기
    const formattedText = text.replace(/[^0-9]/g, '').slice(0, 8);
    // 입력된 숫자를 YYYY-MM-DD 형식으로 변환
    if (formattedText.length >= 6) {
      setBirthDate(
        `${formattedText.slice(0, 4)}-${formattedText.slice(
          4,
          6,
        )}-${formattedText.slice(6, 8)}`,
      );
    } else if (formattedText.length >= 4) {
      setBirthDate(`${formattedText.slice(0, 4)}-${formattedText.slice(4, 6)}`);
    } else {
      setBirthDate(formattedText);
    }
  };

  const handleSignUp = () => {
    if (validateFields()) {
      console.log('회원가입 시도');
      Alert.alert('회원가입 시도');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScreenHeader title={headerText} />

      <View style={styles.formContainer}>
        {/* 아이디 입력 필드 */}
        <InputField
          label="아이디"
          placeholder="아이디를 입력해주세요."
          value={userId}
          onChangeText={setUserId}
          maxLength={20}
          buttonText="중복 확인"
          onButtonPress={handleDuplicateCheck}
          errorText={userIdError}
        />

        {/* 이메일 입력 필드 */}
        <InputField
          label="이메일"
          placeholder="이메일을 입력해주세요."
          value={email}
          onChangeText={setEmail}
          buttonText="본인 인증"
          onButtonPress={handleSendVerification}
          errorText={emailError}
        />

        {/* 이메일 인증번호 입력 필드 */}
        <InputField
          label="인증번호"
          placeholder="이메일로 받은 인증번호를 입력해주세요."
          value={verificationCode}
          onChangeText={setVerificationCode}
          buttonText="인증하기"
          onButtonPress={handleSendVerification}
          errorText={varificationCodeError}
        />

        {/* 이름 입력 필드 */}
        <InputField
          label="이름"
          placeholder="이름을 입력해주세요."
          value={name}
          onChangeText={setName}
          errorText={nameError}
        />

        {/* 비밀번호 입력 필드 */}
        <InputField
          label="비밀번호"
          placeholder="비밀번호를 입력해주세요."
          value={password}
          secureTextEntry={!passwordVisible}
          onChangeText={setPassword}
          errorText={passwordError}
          iconComponent={
            passwordVisible ? (
              <PasswordVisibleIcon width={iconSize.md} height={iconSize.md} />
            ) : (
              <PasswordVisibleOffIcon
                width={iconSize.md}
                height={iconSize.md}
              />
            )
          }
          onIconPress={() => setPasswordVisible(!passwordVisible)}
        />

        {/* 비밀번호 확인 입력 필드 */}
        <InputField
          label="비밀번호 확인"
          placeholder="비밀번호를 한번 더 입력해주세요."
          value={confirmPassword}
          secureTextEntry={!passwordVisible}
          onChangeText={setConfirmPassword}
          errorText={confirmPasswordError}
        />

        {/* 학교 정보 입력 */}
        <View style={styles.schoolInfoContainer}>
          <InputField
            style={{flex: 1}}
            label="학교"
            placeholder="학교 이름을 입력하거나 검색하세요."
            value={school}
            onChangeText={setSchool}
            errorText={confirmPasswordError}
            iconComponent={
              <SearchIcon width={iconSize.md} height={iconSize.md} />
            }
            onIconPress={() =>
              open(<SearchSchoolModal onSelectSchool={setSchool} />, {
                title: '학교 검색',
                size: 'xs',
                onClose: () => {
                  console.log('학교 검색 Closed!');
                },
              })
            }
          />

          {/* 학년, 반 */}
          <View style={styles.gradeClassContainer}>
            <View style={styles.pickerContainer}>
              <Picker
                mode="dropdown"
                dropdownIconColor={colors.light.background.main}
                selectedValue={selectedGrade}
                onValueChange={itemValue => setSelectedGrade(itemValue)}
                style={styles.picker}
                itemStyle={{color: colors.light.text.main}}>
                {Array.from({length: 4}, (_, i) => (
                  <Picker.Item
                    key={i}
                    label={i === 0 ? '학년' : `${i}학년`}
                    value={`${i}`}
                  />
                ))}
              </Picker>
            </View>
            <View style={styles.pickerContainer}>
              <Picker
                mode="dropdown"
                dropdownIconColor={colors.light.background.main}
                selectedValue={selectedClass}
                onValueChange={itemValue => setSelectedClass(itemValue)}
                style={[styles.picker]}
                itemStyle={{color: colors.light.text.main}}>
                {Array.from({length: 16}, (_, i) => (
                  <Picker.Item
                    key={i}
                    label={i === 0 ? '반' : `${i}반`}
                    value={`${i}`}
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        <View style={styles.birthGenderContainer}>
          {/* 생년월일 */}
          <InputField
            style={{flex: 1}}
            label="생년월일"
            placeholder="생년월일 8자리를 입력해주세요"
            value={birthDate}
            onChangeText={handleDateChange}
            keyboardType="numeric"
            maxLength={10}
          />
          {/* 성별 선택 */}
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[
                styles.genderButton,
                gender === 'male' && styles.selectedGenderButton,
              ]}
              onPress={() => setGender('male')}>
              <Text
                weight="bold"
                style={[gender === 'male' && styles.selectedGenderButtonText]}>
                남성
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.genderButton,
                gender === 'female' && styles.selectedGenderButton,
              ]}
              onPress={() => setGender('female')}>
              <Text
                weight="bold"
                style={[
                  gender === 'female' && styles.selectedGenderButtonText,
                ]}>
                여성
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 회원가입 제출 */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSignUp}>
          <Text color="white" weight="bold">
            회원가입
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    flex: 1,
    width: '60%',
    justifyContent: 'center',
  },
  schoolInfoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.md, // 간격 추가
  },
  gradeClassContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  pickerContainer: {
    flex: 1,
    borderRadius: spacing.sm,
    height: getResponsiveSize(30),
    justifyContent: 'center',
    marginBottom: spacing.md,
    backgroundColor: '#f2f4f8',
  },
  picker: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
  },

  birthGenderContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.md,
  },
  genderContainer: {
    flex: 1,
    height: getResponsiveSize(30),
    flexDirection: 'row',
    marginVertical: spacing.md,
  },
  selectedGenderButtonText: {
    color: 'white',
  },
  selectedGenderButton: {
    backgroundColor: '#2e2559',
  },
  genderButton: {
    flex: 1,
    backgroundColor: '#f2f4f8',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: spacing.sm,
    marginHorizontal: spacing.sm,
  },
  submitButton: {
    backgroundColor: '#2e2559',
    paddingVertical: spacing.md,
    borderRadius: 4,
    alignItems: 'center',
  },
});
