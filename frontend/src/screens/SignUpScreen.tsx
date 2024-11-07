import React, {useState, useEffect} from 'react';
import {TouchableOpacity, View, StyleSheet, Alert} from 'react-native';
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

import {
  checkUsername,
  requestEmailVerification,
  signUp,
  verifyEmailCode,
} from '@services/authService';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {borderRadius} from '@theme/borderRadius';
import StatusMessage from '@components/account/StatusMessage';

type NavigationProps = NativeStackNavigationProp<ScreenType>;

function SignUpScreen(): React.JSX.Element {
  const {open} = useModal();
  const navigation = useNavigation<NavigationProps>();
  const {userType} = useRoute().params as {userType: 'teacher' | 'student'};
  const headerText =
    userType === 'teacher' ? '선생님으로 가입하기' : '학생으로 가입하기';

  const [isUsernameChecked, setIsUsernameChecked] = useState(false); // 아이디 중복 체크 완료 여부
  const [isEmailVerified, setIsEmailVerified] = useState(false); // 이메일 인증 완료 여부
  // 회원가입 정보 상태
  const [userId, setUserId] = useState('');
  const [userIdStatusText, setUserIdStatusText] = useState('');
  const [userIdStatusType, setUserIdStatusType] = useState<
    'success' | 'error' | 'info' | ''
  >('info');

  const [email, setEmail] = useState('');
  const [emailStatusText, setEmailStatusText] = useState('');
  const [emailStatusType, setEmailStatusType] = useState<
    'success' | 'error' | 'info' | ''
  >('info');

  const [verificationCode, setVerificationCode] = useState('');
  const [verificationCodeStatusText, setVerificationCodeStatusText] =
    useState('');
  const [verificationCodeStatusType, setVerificationCodeStatusType] = useState<
    'success' | 'error' | 'info' | ''
  >('info');

  const [name, setName] = useState('');
  const [nameStatusText, setNameStatusText] = useState('');
  const [nameStatusType, setNameStatusType] = useState<
    'success' | 'error' | 'info' | ''
  >('info');

  const [password, setPassword] = useState('');
  const [passwordStatusText, setPasswordStatusText] = useState('');
  const [passwordStatusType, setPasswordStatusType] = useState<
    'success' | 'error' | 'info' | ''
  >('info');

  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordStatusText, setConfirmPasswordStatusText] =
    useState('');
  const [confirmPasswordStatusType, setConfirmPasswordStatusType] = useState<
    'success' | 'error' | 'info' | ''
  >('info');

  const [school, setSchool] = useState('');
  const [schoolStatusText, setSchoolStatusText] = useState('');
  const [schoolStatusType, setSchoolStatusType] = useState<
    'success' | 'error' | 'info' | ''
  >('info');

  const [selectedGrade, setSelectedGrade] = useState('0');
  const [selectedGradeStatusText, setSelectedGradeStatusText] = useState('');
  const [selectedGradeStatusType, setSelectedGradeStatusType] = useState<
    'success' | 'error' | 'info' | ''
  >('info');

  const [selectedClass, setSelectedClass] = useState('0');
  const [selectedClassStatusText, setSelectedClassStatusText] = useState('');
  const [selectedClassStatusType, setSelectedClassStatusType] = useState<
    'success' | 'error' | 'info' | ''
  >('info');

  const [birthDate, setBirthDate] = useState('');
  const [birthDateStatusText, setBirthDateStatusText] = useState('');
  const [birthDateStatusType, setBirthDateStatusType] = useState<
    'success' | 'error' | 'info' | ''
  >('info');

  const [tel, setTel] = useState('');
  const [telStatusText, setTelStatusText] = useState('');
  const [telStatusType, setTelStatusType] = useState<
    'success' | 'error' | 'info' | ''
  >('info');

  const [gender, setGender] = useState('');
  const [genderStatusText, setGenderStatusText] = useState('');
  const [genderStatusType, setGenderStatusType] = useState<
    'success' | 'error' | 'info' | ''
  >('info');

  const [passwordVisible, setPasswordVisible] = useState(false);

  const [isVerificationSent, setIsVerificationSent] = useState(false);

  const handleUserIdChange = (text: string) => {
    setUserId(text);
    setIsUsernameChecked(false); // 아이디 변경 시 중복 체크 상태 초기화
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setIsEmailVerified(false); // 이메일 변경 시 인증 상태 초기화
  };

  const validateFields = () => {
    let isValid = true;

    if (!userId) {
      setUserIdStatusText('아이디를 입력해주세요.');
      setUserIdStatusType('error');
      isValid = false;
    } else if (!isUsernameChecked) {
      setUserIdStatusText('아이디 중복 확인을 해주세요.');
      setUserIdStatusType('error');
      isValid = false;
    } else {
      setUserIdStatusText('');
    }

    if (!email.includes('@')) {
      setEmailStatusText('유효한 이메일 주소를 입력해주세요.');
      setEmailStatusType('error');
      isValid = false;
    } else if (!isEmailVerified) {
      setEmailStatusText('이메일 인증을 완료해주세요.');
      setEmailStatusType('error');
      isValid = false;
    } else {
      setEmailStatusText('');
    }

    if (!password.length) {
      setPasswordStatusText('비밀번호를 입력해주세요.');
      setPasswordStatusType('error');
      isValid = false;
    } else {
      setPasswordStatusText('');
    }

    if (password !== confirmPassword) {
      setConfirmPasswordStatusText('비밀번호가 일치하지 않습니다.');
      setConfirmPasswordStatusType('error');
      isValid = false;
    } else {
      setConfirmPasswordStatusText('');
    }

    if (!name) {
      setNameStatusText('이름을 입력해주세요.');
      setNameStatusType('error');
      isValid = false;
    } else {
      setNameStatusText('');
    }

    if (!(tel.length == 13)) {
      setTelStatusText('휴대폰 번호를 입력해주세요.');
      setTelStatusType('error');
      isValid = false;
    } else {
      setTelStatusText('');
    }

    if (!school) {
      setSchoolStatusText('학교 정보를 입력해주세요.');
      setSchoolStatusType('error');
      isValid = false;
    } else {
      setSchoolStatusText('');
    }

    if (!(birthDate.length == 10 && gender)) {
      setBirthDateStatusText('생년월일과 성별 정보를 확인해주세요.');
      setBirthDateStatusType('error');
      isValid = false;
    } else {
      setBirthDateStatusText('');
    }
    return isValid;
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

  // 아이디 중복 확인
  const handleDuplicateCheck = async () => {
    try {
      if (!userId) {
        setUserIdStatusText('아이디를 입력해주세요.');
        setUserIdStatusType('error');
        return;
      }
      const response = await checkUsername(userId);
      setUserIdStatusType('success');
      setUserIdStatusText(response.message);
      setIsUsernameChecked(true); // 중복 체크 완료로 상태 업데이트
    } catch (error) {
      setUserIdStatusType('error');
      setUserIdStatusText(String(error));
      setIsUsernameChecked(false); // 실패 시 체크 완료 취소
    }
  };

  // 이메일로 인증코드 전송
  const handleSendVerification = async () => {
    if (!email || !email.includes('@')) {
      setEmailStatusText('유효한 이메일 주소를 입력해주세요.');
      setEmailStatusType('error');
      return;
    }
    try {
      const response = await requestEmailVerification(email);
      setIsVerificationSent(true);
      setEmailStatusType('success');
      setEmailStatusText(response.message);
    } catch (error) {
      setIsVerificationSent(false);
      setEmailStatusType('error');
      setEmailStatusText(String(error));
    }
  };

  // 인증코드로 본인 인증
  const handleVerificationCodeInput = async () => {
    if (!verificationCode) {
      setVerificationCodeStatusType('error');
      setVerificationCodeStatusText('인증번호를 입력해주세요.');
    }
    try {
      const response = await verifyEmailCode(email, verificationCode);
      setVerificationCodeStatusType('success');
      setVerificationCodeStatusText(response.data.message);
      setIsEmailVerified(true); // 이메일 인증 완료 상태로 업데이트
    } catch (error) {
      setVerificationCodeStatusType('error');
      setVerificationCodeStatusText(String(error));
      setIsEmailVerified(false); // 실패 시 인증 완료 취소
    }
  };

  const handleTelChange = (text: string) => {
    // 숫자만 남기고, 최대 11자리까지 제한
    const cleanedText = text.replace(/[^0-9]/g, '').slice(0, 11);

    // 11자리일 때만 포맷을 적용
    if (cleanedText.length === 11) {
      const formattedText = `${cleanedText.slice(0, 3)}-${cleanedText.slice(
        3,
        7,
      )}-${cleanedText.slice(7)}`;
      setTel(formattedText); // 포맷 적용된 텍스트로 설정
    } else {
      setTel(cleanedText); // 입력 그대로 설정
    }
  };

  const handleDateChange = (text: string) => {
    // 숫자만 입력 받기
    const formattedText = text.replace(/[^0-9]/g, '').slice(0, 8);
    // 입력된 숫자를 YYYY-MM-DD 형식으로 변환
    if (formattedText.length == 8) {
      setBirthDate(
        `${formattedText.slice(0, 4)}-${formattedText.slice(
          4,
          6,
        )}-${formattedText.slice(6, 8)}`,
      );
    } else {
      setBirthDate(formattedText);
    }
  };

  const handleSignUp = async () => {
    if (validateFields()) {
      const role: 'TEACHER' | 'STUDENT' =
        userType === 'teacher' ? 'TEACHER' : 'STUDENT';
      const requestData = {
        id: userId,
        password,
        name,
        email,
        birth: birthDate,
        tel,
        schoolName: school,
        grade: parseInt(selectedGrade, 10),
        classNumber: parseInt(selectedClass, 10),
        role,
      };
      console.log(requestData);
      try {
        const response = await signUp(requestData);
        console.log(requestData);
        Alert.alert(
          '회원가입 성공',
          response.message || '회원가입이 완료되었습니다.',
        );
        navigation.navigate('HomeScreen');
      } catch (error) {
        Alert.alert('회원가입 실패', String(error));
      }
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.scrollContainer}
      enableOnAndroid={true} // Android에서도 활성화
      extraScrollHeight={getResponsiveSize(30)} // 키보드가 활성화될 때 추가적으로 스크롤하는 높이
    >
      <ScreenHeader title={headerText} />

      <View style={styles.formContainer}>
        {/* 아이디 입력 필드 */}
        <InputField
          label="아이디"
          placeholder="아이디를 입력해주세요."
          value={userId}
          onChangeText={handleUserIdChange}
          maxLength={20}
          buttonText="중복 확인"
          onButtonPress={handleDuplicateCheck}
          statusText={userIdStatusText}
          status={userIdStatusType}
        />

        {/* 이메일 입력 필드 */}
        <InputField
          label="이메일"
          placeholder="이메일을 입력해주세요."
          value={email}
          onChangeText={handleEmailChange}
          buttonText="본인 인증"
          onButtonPress={handleSendVerification}
          statusText={emailStatusText}
          status={emailStatusType}
        />
        
        {/* 이메일 인증코드 입력 필드 */}
        {isVerificationSent && (
          <InputField
            label="인증번호"
            placeholder="이메일로 받은 인증번호를 입력해주세요."
            value={verificationCode}
            onChangeText={setVerificationCode}
            buttonText="인증하기"
            onButtonPress={handleVerificationCodeInput}
            statusText={verificationCodeStatusText}
            status={verificationCodeStatusType}
          />
        )}

        {/* 비밀번호 입력 필드 */}
        <InputField
          label="비밀번호"
          placeholder="비밀번호를 입력해주세요."
          value={password}
          secureTextEntry={!passwordVisible}
          onChangeText={setPassword}
          statusText={passwordStatusText}
          status={passwordStatusType}
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
          statusText={confirmPasswordStatusText}
          status={confirmPasswordStatusType}
        />

        {/* 이름 입력 필드 */}
        <InputField
          label="이름"
          placeholder="이름을 입력해주세요."
          value={name}
          onChangeText={setName}
          statusText={nameStatusText}
          status={nameStatusType}
        />

        {/* 휴대폰 번호 입력 필드 */}
        <InputField
          label="휴대폰 번호"
          placeholder="휴대폰 번호 11자리를 입력해주세요."
          value={tel}
          onChangeText={handleTelChange}
          statusText={telStatusText}
          status={telStatusType}
          keyboardType="numeric"
          maxLength={13}
        />

        {/* 학교 정보 입력 */}
        <View>
          <View style={styles.schoolInfoContainer}>
            <InputField
              style={{flex: 1}}
              label="학교"
              placeholder="학교 이름을 입력하거나 검색하세요."
              value={school}
              onChangeText={setSchool}
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
          <StatusMessage status={schoolStatusType} message={schoolStatusText} />
        </View>

        <View>
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
                  style={[
                    gender === 'male' && styles.selectedGenderButtonText,
                  ]}>
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
          <StatusMessage
            status={birthDateStatusType}
            message={birthDateStatusText}
          />
        </View>
        {/* 회원가입 제출 */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSignUp}>
          <Text color="white" weight="bold">
            회원가입
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}

export default SignUpScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: colors.light.background.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    flex: 1,
    width: '55%',
    justifyContent: 'center',
  },
  schoolInfoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.md,
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
    marginTop: spacing.lg,
    backgroundColor: colors.light.background.main,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
  },
});