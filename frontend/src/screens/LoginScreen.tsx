import React, {useState, useEffect} from 'react';
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

import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScreenType, useCurrentScreenStore} from '@store/useCurrentScreenStore';

import {logIn} from '@services/authService';
import InputField from '@components/account/InputField';

import {getToken, setAutoLogin, getAutoLoginStatus} from '@utils/secureStorage';
import {useAuthStore} from '@store/useAuthStore';
type NavigationProps = NativeStackNavigationProp<ScreenType>;

function LoginScreen(): React.JSX.Element {
  const [isChecked, setIsChecked] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigation = useNavigation<NavigationProps>();
  const {setCurrentScreen} = useCurrentScreenStore();

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);

  // 잠시 주석 처리

  // useEffect(() => {
  //   const initializeAuth = async () => {
  //     // 자동 로그인 상태와 토큰 확인
  //     const autoLoginEnabled = await getAutoLoginStatus();
  //     const tokenData = await getToken();

  //     console.log (autoLoginEnabled, tokenData)
      
  //     if (autoLoginEnabled && tokenData?.accessToken) {
  //       // 토큰이 존재하고 자동 로그인이 활성화된 경우
  //       setIsLoggedIn(true); // 스토어 상태를 로그인으로 설정
  //       navigation.navigate('HomeScreen'); // 홈 화면으로 이동
  //     } else {
  //       setIsLoggedIn(false); // 스토어 상태를 로그아웃 상태로 설정
  //       navigation.navigate('LoginScreen'); // 로그인 화면으로 이동
  //     }
  //   };

  //   initializeAuth();
  // }, []);

  const handleLogin = async () => {
    try {
      const response = await logIn({id, password});

      // 자동 로그인 설정 상태 저장
      await setAutoLogin(isChecked);
      console.log('auto', isChecked)
      navigation.navigate('HomeScreen');
      setCurrentScreen('HomeScreen');
    } catch (error) {
      console.log(error);
    }
  };

  const moveSignUp = () => {
    navigation.navigate('SignUpSelectScreen');
    setCurrentScreen('SignUpSelectScreen');
  };

  const moveFindId = () => {
    navigation.navigate('FindIdScreen');
    setCurrentScreen('FindIdScreen');
  };

  const moveFindPassword = () => {
    navigation.navigate('FindPasswordScreen');
    setCurrentScreen('FindPasswordScreen');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={serviceLogoImage} />
        <Text weight="bold">"선생님과 학생을 잇는 지식의 다리"</Text>
      </View>

      <View style={styles.loginfield}>
        <View>
          <InputField
            label="아이디"
            value={id}
            onChangeText={setId}
            placeholder="아이디를 입력해주세요."
          />
          <InputField
            label="비밀번호"
            value={password}
            onChangeText={setPassword}
            placeholder="비밀번호를 입력해주세요."
            secureTextEntry={!passwordVisible}
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
          <Text style={styles.submitButtonText} color="white" weight="bold">
            로그인
          </Text>
        </TouchableOpacity>

        <View style={styles.accountContainer}>
          <TouchableOpacity
            style={styles.moveScreenButton}
            onPress={moveSignUp}>
            <Text style={styles.submitButtonText}>회원가입</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.moveScreenButton}
            onPress={moveFindId}>
            <Text style={styles.submitButtonText}>아이디 찾기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.moveScreenButton}
            onPress={moveFindPassword}>
            <Text style={styles.submitButtonText}>비밀번호 찾기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
    gap: spacing.xl,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
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
    height: '10%',
  },
  submitButtonText: {
    textAlign: 'center',
  },
  moveScreenButton: {
    alignItems: 'center',
    width: '20%',
  },
  accountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: spacing.xl,
  },
});
