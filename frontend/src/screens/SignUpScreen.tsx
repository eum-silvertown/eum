import React, {useState, useEffect} from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Text} from '@components/common/Text';
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
import {borderRadius} from '@theme/borderRadius';
import StatusMessage from '@components/account/StatusMessage';
import CustomDropdownPicker from '@components/common/CustomDropdownPicker';

type NavigationProps = NativeStackNavigationProp<ScreenType>;

function SignUpScreen(): React.JSX.Element {
  const {open} = useModal();
  const navigation = useNavigation<NavigationProps>();
  const {setCurrentScreen} = useCurrentScreenStore();
  const {userType} = useRoute().params as {userType: 'teacher' | 'student'};
  const headerText =
    userType === 'teacher' ? '선생님으로 가입하기' : '학생으로 가입하기';

  const [isUsernameChecked, setIsUsernameChecked] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

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
  const [selectedClass, setSelectedClass] = useState('0');

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

  const [passwordVisible, setPasswordVisible] = useState(false);

  const [isVerificationSent, setIsVerificationSent] = useState(false);

  // 각 버튼의 로딩 상태를 위한 useState
  const [idLoading, setIdLoading] = useState(false);
  const [emailVerificationLoading, setEmailVerificationLoading] =
    useState(false);
  const [codeVerificationLoading, setCodeVerificationLoading] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(false);

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
      setTelStatusText('휴대전화번호를 입력해주세요.');
      setTelStatusType('error');
      isValid = false;
    } else {
      setTelStatusText('');
    }

    if (!school || selectedGrade === '0' || selectedClass === '0') {
      setSchoolStatusText('학교 정보를 모두 입력해주세요.');
      setSchoolStatusType('error');
      isValid = false;
    } else {
      setSchoolStatusText('');
    }

    if (!(birthDate.length == 10 && gender)) {
      setBirthDateStatusText('생년월일과 성별 정보를 입력해주세요.');
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
    setIdLoading(true); // 로딩 시작
    try {
      if (!userId) {
        setUserIdStatusText('아이디를 입력해주세요.');
        setUserIdStatusType('error');
        return;
      }
      await checkUsername(userId);
      setUserIdStatusType('success');
      setUserIdStatusText('사용 가능한 ID 입니다.');
      setIsUsernameChecked(true); // 중복 체크 완료로 상태 업데이트
    } catch (error) {
      setUserIdStatusType('error');
      setUserIdStatusText(String(error));
      setIsUsernameChecked(false); // 실패 시 체크 완료 취소
    } finally {
      setIdLoading(false); // 로딩 종료
    }
  };

  // 이메일로 인증코드 전송
  const handleSendVerification = async () => {
    if (!email || !email.includes('@')) {
      setEmailStatusText('유효한 이메일 주소를 입력해주세요.');
      setEmailStatusType('error');
      return;
    }
    setEmailVerificationLoading(true); // 로딩 시작
    try {
      const response = await requestEmailVerification(email);
      setIsVerificationSent(true);
      setEmailStatusType('success');
      setEmailStatusText(response.message);
      Alert.alert('이메일로 인증 코드를 전송하였습니다. 확인 후 인증해주세요.');
    } catch (error) {
      setIsVerificationSent(false);
      setEmailStatusType('error');
      setEmailStatusText(String(error));
    } finally {
      setEmailVerificationLoading(false); // 로딩 종료
    }
  };

  // 인증코드로 본인 인증
  const handleVerificationCodeInput = async () => {
    if (!verificationCode) {
      setVerificationCodeStatusType('error');
      setVerificationCodeStatusText('인증코드를 입력해주세요.');
      return;
    }

    setCodeVerificationLoading(true); // 로딩 시작
    try {
      const response = await verifyEmailCode(email, verificationCode);
      setVerificationCodeStatusType('success');
      setVerificationCodeStatusText(response.data.message);
      setIsEmailVerified(true); // 이메일 인증 완료 상태로 업데이트
    } catch (error) {
      setVerificationCodeStatusType('error');
      setVerificationCodeStatusText(String(error));
      setIsEmailVerified(false); // 실패 시 인증 완료 취소
    } finally {
      setCodeVerificationLoading(false); // 로딩 종료
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
    if (formattedText.length === 8) {
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

  // 회원 가입
  const handleSignUp = async () => {
    if (validateFields()) {
      setSignUpLoading(true); // 로딩 시작
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
        await signUp(requestData);
        console.log(requestData);
        Alert.alert('회원가입 성공', '회원가입이 완료되었습니다.');
        navigation.reset({
          index: 0,
          routes: [{name: 'HomeScreen'}],
        });
        setCurrentScreen('HomeScreen');
      } catch (error) {
        Alert.alert('회원가입 실패', String(error));
      } finally {
        setSignUpLoading(false);
      }
    }
  };

  return (
    <View style={styles.layout}>
      <ScreenHeader title={headerText} />
      <View style={styles.container}>
        <View>
          <View style={styles.formContainer}>
            <View style={styles.innerContainer}>
              {/* 아이디 입력 필드 */}
              <InputField
                label="아이디"
                placeholder="아이디를 입력해주세요."
                value={userId}
                onChangeText={handleUserIdChange}
                buttonText={idLoading ? '확인 중...' : '중복 확인'}
                onButtonPress={handleDuplicateCheck}
                statusText={userIdStatusText}
                status={userIdStatusType}
                maxLength={20}
              />
              {/* 이메일 입력 필드 */}
              <InputField
                label="이메일"
                placeholder="이메일을 입력해주세요."
                value={email}
                keyboardType="email-address"
                onChangeText={handleEmailChange}
                buttonText={
                  emailVerificationLoading ? '발송 중...' : '본인 인증'
                }
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
                  buttonText={
                    codeVerificationLoading ? '인증 중...' : '인증하기'
                  }
                  onButtonPress={handleVerificationCodeInput}
                  statusText={verificationCodeStatusText}
                  status={verificationCodeStatusType}
                  maxLength={8}
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
                    <PasswordVisibleIcon
                      width={iconSize.md}
                      height={iconSize.md}
                    />
                  ) : (
                    <PasswordVisibleOffIcon
                      width={iconSize.md}
                      height={iconSize.md}
                    />
                  )
                }
                onIconPress={() => setPasswordVisible(!passwordVisible)}
                maxLength={64}
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
                maxLength={64}
              />
            </View>

            {/* 중앙 구분선 */}
            <View style={styles.divider} />

            <View style={styles.innerContainer}>
              {/* 이름 입력 필드 */}
              <InputField
                label="이름"
                placeholder="이름을 입력해주세요."
                value={name}
                onChangeText={setName}
                statusText={nameStatusText}
                status={nameStatusType}
                maxLength={10}
              />
              {/* 휴대전화번호 입력 필드 */}
              <InputField
                label="휴대전화번호"
                placeholder="휴대전화번호 11자리를 입력해주세요."
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
                    maxLength={50}
                  />
                  {/* 학년, 반 */}
                  <View style={styles.gradeClassContainer}>
                    <View style={styles.pickerContainer}>
                      {/* 학년 선택 드롭다운 */}
                      <CustomDropdownPicker
                        label="학년"
                        items={Array.from({length: 4}, (_, i) => ({
                          label: i === 0 ? '학년 선택' : `${i}학년`,
                          value: `${i}`,
                        }))}
                        onSelectItem={value => setSelectedGrade(value)}
                        defaultValue={selectedGrade} // 선택된 학년 값 전달
                      />
                    </View>
                    <View style={styles.pickerContainer}>
                      {/* 반 선택 드롭다운 */}
                      <CustomDropdownPicker
                        label="반"
                        items={Array.from({length: 16}, (_, i) => ({
                          label: i === 0 ? '반' : `${i}반`,
                          value: `${i}`,
                        }))}
                        onSelectItem={value => setSelectedClass(value)}
                        defaultValue={selectedClass}
                      />
                    </View>
                  </View>
                </View>
                <StatusMessage
                  status={schoolStatusType}
                  message={schoolStatusText}
                />
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
                          gender === 'female' &&
                            styles.selectedGenderButtonText,
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
            </View>
          </View>
          {/* 회원가입 버튼 */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSignUp}
            disabled={signUpLoading} // 로딩 중 버튼 비활성화
          >
            {signUpLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text color="white" weight="bold">
                회원가입
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default SignUpScreen;

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: colors.light.background.white,
  },
  container: {
    flex: 1,
    width: '90%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  formContainer: {
    flexDirection: 'row',
    gap: 40,
  },
  innerContainer: {
    flex: 1,
    gap: 15,
  },
  schoolInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 25,
  },
  gradeClassContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    alignSelf: 'flex-end',
  },
  pickerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  birthGenderContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    gap: 25,
    marginBottom: 10,
  },
  genderContainer: {
    flexDirection: 'row',
    flex: 1,
    gap: 10,
    justifyContent: 'center',
  },
  selectedGenderButton: {
    backgroundColor: colors.light.background.main,
  },
  genderButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.sm,
    marginHorizontal: 3,
    marginVertical: 10,
    backgroundColor: colors.light.background.input,
    height: getResponsiveSize(25),
    alignSelf: 'flex-end',
  },
  selectedGenderButtonText: {
    color: 'white',
  },
  submitButton: {
    backgroundColor: colors.light.background.main,
    paddingVertical: 10,
    alignItems: 'center',
    marginVertical: 25,
    alignSelf: 'center',
    width: '50%',
  },
  divider: {
    width: 1,
    backgroundColor: '#C1C1C1',
    marginHorizontal: 5,
  },
});
