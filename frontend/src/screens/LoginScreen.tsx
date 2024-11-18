import React, {useState} from 'react';
import {TouchableOpacity, StyleSheet, View, Image} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Text} from '@components/common/Text';
import PasswordVisibleIcon from '@assets/icons/passwordVisibleIcon.svg';
import PasswordVisibleOffIcon from '@assets/icons/passwordVisibleOffIcon.svg';
import serviceLogoImage from '@assets/images/serviceLogoImage.png';
import {iconSize} from '@theme/iconSize';
import {colors} from 'src/hooks/useColors';
import {logIn} from '@services/authService';
import InputField from '@components/account/InputField';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScreenType, useCurrentScreenStore} from '@store/useCurrentScreenStore';

// import CheckBox from '@react-native-community/checkbox';
// import {setAutoLogin} from '@utils/secureStorage';

type NavigationProps = NativeStackNavigationProp<ScreenType>;

function LoginScreen(): React.JSX.Element {
  // const [isChecked, setIsChecked] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigation = useNavigation<NavigationProps>();
  const {setCurrentScreen} = useCurrentScreenStore();

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const [loginErrorText, setLoginErrorText] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      // 화면이 포커스될 때마다 id와 password 상태 초기화
      setId('');
      setPassword('');
    }, []),
  );

  const handleLogin = async () => {
    if (!id || !password) {
      setLoginErrorText('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    try {
      await logIn({id, password});
      // 자동 로그인 설정 상태 저장
      // await setAutoLogin(isChecked);

      // 내비게이션 스택을 초기화하여 로그인 화면으로 이동
      navigation.reset({
        index: 0,
        routes: [{name: 'HomeScreen'}],
      });
      setCurrentScreen('HomeScreen');
    } catch (error: any) {
      // 에러 메시지를 string으로 변환하여 상태에 설정
      if (error?.message) {
        setLoginErrorText(error.message);
      } else {
        setLoginErrorText('로그인에 실패했습니다. 다시 시도해주세요.');
      }
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
        <View style={{gap: 10}}>
          <InputField
            label="아이디"
            value={id}
            onChangeText={text => {
              setId(text);
              setLoginErrorText('');
            }}
            placeholder="아이디를 입력해주세요."
            maxLength={20}
          />
          <InputField
            label="비밀번호"
            value={password}
            onChangeText={text => {
              setPassword(text);
              setLoginErrorText('');
            }}
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
            status="error"
            statusText={loginErrorText}
            maxLength={64}
          />
          {/* 자동 로그인 항시 사용으로 인한 주석 처리 */}
          {/* <View style={styles.checkboxContainer}>
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
          </View> */}
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
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginfield: {
    width: '50%',
    gap: 25,
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
  submitButton: {
    backgroundColor: colors.light.background.main,
    paddingVertical: 10,
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
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
    justifyContent: 'space-around',
  },
});
