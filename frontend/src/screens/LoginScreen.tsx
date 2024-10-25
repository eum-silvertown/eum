import React, {useState} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
  TextInput,
} from 'react-native';
import {Text} from '@components/common/Text';
import {spacing} from '@theme/spacing';
import CheckBox from '@react-native-community/checkbox'; // 체크박스 라이브러리 추가
import PasswordVisibleIcon from '@assets/icons/passwordVisibleIcon.svg';
import PasswordVisibleOffIcon from '@assets/icons/passwordVisibleOffIcon.svg';
import serviceLogoImage from '@assets/images/serviceLogoImage.png';
import {iconSize} from '@theme/iconSize';
import {colors} from 'src/hooks/useColors';
import {useAuthStore} from '@store/useAuthStore';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScreenType, useCurrentScreenStore} from '@store/useCurrentScreenStore';

type NavigationProps = NativeStackNavigationProp<ScreenType>;

function LoginScreen(): React.JSX.Element {
  const [isChecked, setIsChecked] = useState(false); // 체크박스 상태 관리
  const [passwordVisible, setPasswordVisible] = useState(false); // 비밀번호 표시 여부 상태
  const login = useAuthStore(state => state.login); // login 메서드 가져오기
  const navigation = useNavigation<NavigationProps>();
  const {setCurrentScreen} = useCurrentScreenStore();

  // 임시 로그인 함수
  const handleLogin = () => {
    // 임시 사용자 이름과 비밀번호를 사용해 로그인
    login('tempUser', 'password123');
    navigation.navigate('HomeScreen');
    setCurrentScreen('HomeScreen');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={serviceLogoImage} />
        <Text weight="bold">"선생님과 학생을 잇는 지식의 다리"</Text>
      </View>

      <View style={styles.loginfield}>
        <View style={styles.inputField}>
          <Text weight="bold">아이디</Text>
          <TextInput placeholder="아이디를 입력해주세요." />
        </View>
        <View style={styles.inputField}>
          <Text weight="bold">비밀번호</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="비밀번호를 입력해주세요."
              secureTextEntry={!passwordVisible}
              style={styles.passwordInput}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)} // 버튼을 눌렀을 때 상태 변경
              style={styles.iconButton}>
              {passwordVisible ? (
                <PasswordVisibleIcon width={iconSize.md} height={iconSize.md} />
              ) : (
                <PasswordVisibleOffIcon
                  width={iconSize.md}
                  height={iconSize.md}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.loginOptions}>
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              onPress={() => setIsChecked(!isChecked)} // 클릭 시 체크박스 상태 변경
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <CheckBox
                value={isChecked}
                onValueChange={setIsChecked}
                tintColors={{true: '#2E2559', false: '#2E2559'}}
              />
              <Text>자동 로그인</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleLogin}>
          <Text style={styles.submitButtonText} color="white">
            로그인
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.moveScreenButton}>
          <Text style={styles.submitButtonText}>회원가입</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginfield: {
    width: '50%',
    gap: spacing.xl, // 각 요소 간의 간격 설정
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
  },
  iconButton: {
    padding: 8,
  },
  loginOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  inputField: {},
  submitButton: {
    backgroundColor: colors.dark.background.main,
    textAlign: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 50,
  },
  submitButtonText: {
    textAlign: 'center',
  },
  moveScreenButton: {
    alignItems: 'center',
  },
});
