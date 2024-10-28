import React, {useState} from 'react';
import {
  TouchableOpacity,
  View,
  TextInput,
  StyleSheet,
  Alert,
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

type NavigationProps = NativeStackNavigationProp<ScreenType>;

function SignUpScreen(): React.JSX.Element {
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
  const [gradeModalVisible, setGradeModalVisible] = useState(false);
  const [classModalVisible, setClassModalVisible] = useState(false);
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');

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
    console.log('회원가입 시도');
    Alert.alert('회원가입 시도');
  };

  return (
    <View style={styles.outerContainer}>
      {/* 뒤로가기, 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackArrowIcon />
        </TouchableOpacity>
        <Text variant="title" style={styles.headerText} weight="bold">
          {headerText}
        </Text>
      </View>

      <View style={styles.formContainer}>
        {/* 아이디 입력 필드 */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>아이디</Text>
          <View style={styles.inputBox}>
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
        </View>

        {/* 학교 정보 입력 */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>학교</Text>
          <View style={styles.inputBox}>
            <View style={styles.inputField}>
              <TextInput
                style={styles.inputField}
                placeholder="예) 싸피중학교"
                keyboardType="default" // 기본 키보드 타입
                value={school}                
                onChangeText={setSchool}
              />
              <TouchableOpacity style={styles.inputIcon}>
                <SearchIcon width={24} height={24} />
              </TouchableOpacity>
            </View>

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
                  {Array.from({length: 11}, (_, i) => (
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
          <TouchableOpacity>
            <TextInput
              style={styles.inputField}
              placeholder="예) 1996-06-24"
              value={birthDate}
              onChangeText={handleDateChange}
              keyboardType="numeric"
              maxLength={10}
            />
          </TouchableOpacity>
        </View>

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

        {/* 회원가입 제출 */}
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpButtonText}>회원가입</Text>
        </TouchableOpacity>
      </View>
    </View>
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

  formContainer: {
    flex: 1,
    padding: spacing.md,
    width: '50%',
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
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputField: {
    width: '100%',
    height: 50, // 높이 고정
    backgroundColor: '#f2f4f8',
    borderBottomWidth: 1,
    borderBottomColor: '#463986',
    paddingHorizontal: spacing.sm,
    color: '#555555',

    position: 'relative',
  },

  inputIcon: {
    position: 'absolute',
    right: 0,
    top: 0,
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
  closeButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#2e2559',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  gradeContainer: {    
    flexDirection: 'row',    
    justifyContent: 'space-between',
    marginVertical: spacing.md,
  },
  gradeButton: {
    width: 110,    
    backgroundColor: '#ebebeb',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },  
  genderContainer: {
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
});
