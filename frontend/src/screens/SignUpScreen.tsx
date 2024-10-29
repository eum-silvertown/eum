import React, {useState} from 'react';
import {
  TouchableOpacity,
  View,
  TextInput,
  StyleSheet,
  Alert,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Text} from '@components/common/Text';
import {spacing} from '@theme/spacing';
import {colors} from 'src/hooks/useColors';
import {useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScreenType, useCurrentScreenStore} from '@store/useCurrentScreenStore';
import BackArrowIcon from '@assets/icons/backArrowIcon.svg';
import SearchIcon from '@assets/icons/searchIcon.svg';
import {iconSize} from '@theme/iconSize';
import Config from "react-native-config";

type NavigationProps = NativeStackNavigationProp<ScreenType>;

interface School {
  seq: string;
  schoolName: string;
  region: string;
}

interface SchoolListItem {
  id: string;
  name: string;
  region: string;
}

function SignUpScreen(): React.JSX.Element {
  const API_KEY = Config.CAREERNET_API_KEY;
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
  const [selectdSchoolLevel, setSelectedSchoolLevel] = useState('midd_list');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [searchSchoolModal, setSearchSchoolModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [schoolList, setSchoolList] = useState<SchoolListItem[]>([]);

  // 유효성 검사 상태
  const [userIdError, setUserIdError] = useState('');
  const [emailError, setEmailError] = useState('');
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
      setPasswordError('비밀번호는 6자리 이상이어야 합니다.');
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
  

  const handleDuplicateCheck = () => {
    console.log('아이디 중복 확인:', userId);
    Alert.alert('아이디 중복 확인');
  };

  const handleSendVerification = () => {
    console.log('인증 이메일 전송:', email);
    Alert.alert(email + '인증번호를 전송하였습니다.');
    setIsVerificationSent(true);
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

  const handleSearchSchoolModal = (visible: boolean) => {
    // 검색창 초기화
    setSelectedSchoolLevel('midd_list');
    setSearchQuery('');
    setSchoolList([]);

    setSearchSchoolModal(visible);
  };

  // 학교 검색 API 호출
  const searchSchool = async () => {
    try {
      const YOUR_API_URL = `https://www.career.go.kr/cnet/openapi/getOpenApi?apiKey=${API_KEY}&svcType=api&svcCode=SCHOOL&contentType=json&gubun=${selectdSchoolLevel}&searchSchulNm=${searchQuery}`;
      const response = await fetch(YOUR_API_URL);
      const data = await response.json();
      const schools = data.dataSearch.content.map((school: School) => ({
        id: school.seq, // 고유 식별자
        name: school.schoolName,
        region: school.region,
      }));
      console.log('학교 검색을 성공하였습니다.');
      console.log(selectdSchoolLevel);
      setSchoolList(schools); // 검색 결과를 상태에 저장하여 FlatList로 표시
    } catch (error) {
      console.error('학교 검색 중 오류가 발생했습니다.', error);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.outerContainer}>
      {/* 뒤로가기, 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackArrowIcon />
        </TouchableOpacity>
        <Text variant="title" style={styles.headerText} weight="bold">
          {headerText}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          {/* 아이디 입력 필드 */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>아이디</Text>
            <View
             style={styles.inputBox}
            >
              <TextInput
                style={styles.inputField}
                placeholder="예) test1234"
                value={userId}
                onChangeText={setUserId}
              />
              <TouchableOpacity
                style={styles.smallButton}
                onPress={handleDuplicateCheck}>
                <Text style={styles.buttonText}>중복확인</Text>
              </TouchableOpacity>
            </View>
            {userIdError ? <Text style={styles.errorText}>{userIdError}</Text> : null}
          </View>

          {/* 이메일 입력 필드 */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>이메일</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.inputField}
                placeholder="예) test1234@ssafy.com"
                value={email}
                onChangeText={setEmail}
              />
              <TouchableOpacity
                style={styles.smallButton}
                onPress={handleSendVerification}>
                <Text style={styles.buttonText}>본인인증</Text>
              </TouchableOpacity>
            </View>
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
          </View>

          {/* 이름 입력 필드 */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>이름</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.inputField}
                placeholder="예) 홍길동"
                value={name}
                onChangeText={setName}
              />              
            </View>
            {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
          </View>

          {/* 비밀번호 입력 필드 */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>비밀번호</Text>
            <TextInput
              style={styles.inputField}
              placeholder="영문, 숫자 포함 6~40자리"
              value={password}
              secureTextEntry
              onChangeText={setPassword}
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          </View>

          {/* 비밀번호 확인 입력 필드 */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>비밀번호 확인</Text>
            <TextInput
              style={styles.inputField}
              placeholder="비밀번호 확인"
              value={confirmPassword}
              secureTextEntry
              onChangeText={setConfirmPassword}
            />
            {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
          </View>

          {/* 학교 정보 입력 */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>학교</Text>
            <View style={styles.inputBox}>
              <View style={styles.inputFieldWrapper}>
                <TextInput
                  style={styles.inputField}
                  placeholder="예) 싸피중학교"
                  keyboardType="default"
                  value={school}
                  onChangeText={setSchool}
                />
                <TouchableOpacity
                  style={styles.inputIcon}
                  onPress={() => handleSearchSchoolModal(true)}>
                  <SearchIcon width={iconSize.md} height={iconSize.md} />
                </TouchableOpacity>
              </View>

              {/* 학교 검색 모달 */}
              <Modal
                visible={searchSchoolModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => handleSearchSchoolModal(false)} // 뒤로가기 시 모달 닫기
              >
                <View style={styles.modalBackground}>
                  <View style={styles.modalContent}>
                    <Text>학교 검색하기</Text>
                    <Picker
                      selectedValue={selectdSchoolLevel}
                      onValueChange={itemValue =>
                        setSelectedSchoolLevel(itemValue)
                      }
                      style={styles.picker}>
                      <Picker.Item key={0} label="중학교" value="midd_list" />
                      <Picker.Item key={1} label="고등학교" value="high_list" />
                    </Picker>
                    <TextInput
                      placeholder="학교를 검색해주세요."
                      value={searchQuery}
                      onChangeText={setSearchQuery}></TextInput>

                    <TouchableOpacity onPress={() => searchSchool()}>
                      <Text>검색하기</Text>
                    </TouchableOpacity>

                    <FlatList
                      data={schoolList}
                      keyExtractor={item => item.id.toString()}
                      renderItem={({item}) => (
                        <TouchableOpacity
                          onPress={() => {
                            setSchool(item.name);
                            setSearchSchoolModal(false);
                          }}>
                          <Text>
                            {item.name}({item.region})
                          </Text>
                        </TouchableOpacity>
                      )}
                    />

                    {/* 닫기 버튼 */}
                    <TouchableOpacity
                      onPress={() => handleSearchSchoolModal(false)}>
                      <Text>닫기</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

              {/* 학년, 반 */}
              <View style={styles.gradeContainer}>
                <TouchableOpacity style={styles.gradeButton}>
                  <Picker
                    selectedValue={selectedGrade}
                    onValueChange={itemValue => setSelectedGrade(itemValue)}
                    style={styles.picker}>
                    {Array.from({length: 4}, (_, i) => (
                      <Picker.Item
                        key={i}
                        label={i === 0 ? '학년' : `${i}학년`}
                        value={`${i}`}
                      />
                    ))}
                  </Picker>
                </TouchableOpacity>
                <TouchableOpacity style={styles.gradeButton}>
                  <Picker
                    selectedValue={selectedClass}
                    onValueChange={itemValue => setSelectedClass(itemValue)}
                    style={styles.picker}>
                    {Array.from({length: 16}, (_, i) => (
                      <Picker.Item
                        key={i}
                        label={i === 0 ? '반' : `${i}반`}
                        value={`${i}`}
                      />
                    ))}
                  </Picker>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* 생년월일 */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>생년월일</Text>

            <View style={styles.inputBox}>
              <TouchableOpacity style={{flex: 1}}>
                <TextInput
                  style={styles.inputField}
                  placeholder="예) 1996-06-24"
                  value={birthDate}
                  onChangeText={handleDateChange}
                  keyboardType="numeric"
                  maxLength={10}
                />
              </TouchableOpacity>
              {/* 성별 선택 */}
              <View style={styles.genderContainer}>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    gender === 'male' && styles.selectedGenderButton,
                  ]}
                  onPress={() => setGender('male')}>
                  <Text
                    style={[
                      styles.genderButtonText,
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
                    style={[
                      styles.genderButtonText,
                      gender === 'female' && styles.selectedGenderButtonText,
                    ]}>
                    여성
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* 회원가입 제출 */}
          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.signUpButtonText}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default SignUpScreen;

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    flex: 1,
    padding: spacing.md,
    width: '70%',
    justifyContent: 'center',
  },
  header: {
    position: 'absolute',
    top: spacing.xl,
    left: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: '#2e2559',
    fontSize: 32,
    fontWeight: 'bold',
    marginLeft: spacing.sm,
  },
  inputContainer: {
    width: '100%',
    marginBottom: spacing.md,
  },
  inputLabel: {
    color: '#2e2559',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  inputBox: {
    gap: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputField: {
    width: '100%',
    height: 50, // 높이 고정
    backgroundColor: '#f2f4f8',
    borderBottomWidth: 1,
    borderBottomColor: '#463986',
    paddingHorizontal: spacing.sm,
    color: colors.light.text.main,
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    right: spacing.xs,   
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallButton: {
    position: 'absolute',
    right: 0,
    backgroundColor: '#2e2559',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  picker: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  inputFieldWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',   
    marginRight: spacing.sm,
    height: 50,
  },
  gradeContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: spacing.md,
  },
  gradeButton: {
    flex: 1,
    marginHorizontal: spacing.sm,
    backgroundColor: '#ebebeb',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genderContainer: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: spacing.md,
  },
  genderButton: {
    flex: 1,
    height: 48,
    backgroundColor: '#f2f4f8',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginHorizontal: 4,
  },
  selectedGenderButton: {
    backgroundColor: '#2e2559',
  },
  genderButtonText: {
    color: '#2e2559',
    fontWeight: 'bold',
  },
  selectedGenderButtonText: {
    color: 'white',
  },
  signUpButton: {
    backgroundColor: '#2e2559',
    paddingVertical: spacing.md,
    borderRadius: 4,
    alignItems: 'center',
  },
  signUpButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },

  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 배경을 반투명하게 설정
    justifyContent: 'center', // 중앙 정렬
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    marginTop: 15,
    color: 'blue',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 4,
  },
});
