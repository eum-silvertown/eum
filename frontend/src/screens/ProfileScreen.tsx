import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {launchImageLibrary} from 'react-native-image-picker';

import {Text} from '@components/common/Text';
import {spacing} from '@theme/spacing';
import ScreenInfo from '@components/common/ScreenInfo';
import {getResponsiveSize} from '@utils/responsive';
import {borderRadius} from '@theme/borderRadius';
import {colors} from 'src/hooks/useColors';
import defaultProfileImage from '@assets/images/defaultProfileImage.png';
import {iconSize} from '@theme/iconSize';
import {borderWidth} from '@theme/borderWidth';
import {getUserInfo, updateProfilePicture, logOut} from '@services/authService';
import {useAuthStore} from '@store/useAuthStore';
import axios from 'axios';

import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScreenType, useCurrentScreenStore} from '@store/useCurrentScreenStore';

import {useModal} from 'src/hooks/useModal';
import PasswordChangeModal from '@components/account/PasswordChangeModal';
import SignOutModal from '@components/account/SignOutModal';
import {setAutoLogin} from '@utils/secureStorage';

type NavigationProps = NativeStackNavigationProp<ScreenType>;

interface UploadResponse {
  uri: string;
  fileName: string;
  type: string;
}

export default function ProfileScreen(): React.JSX.Element {
  const navigation = useNavigation<NavigationProps>();
  const {setCurrentScreen} = useCurrentScreenStore();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const {open} = useModal();
  const authStore = useAuthStore();

  useEffect(() => {
    // 페이지가 로드될 때 한 번만 실행할 함수
    const fetchData = async () => {
      try {
        // 예: API 호출 또는 초기화 작업
        const response = await getUserInfo();
      } catch (error) {}
    };

    fetchData(); // 함수 호출
  }, []); // 빈 배열로 의존성 설정: 컴포넌트가 처음 로드될 때만 실행

  // 사진, 갤러리 권한 요청
  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      // Android 13 이상에서는 READ_MEDIA_* 권한 요청
      if (Platform.Version >= 33) {
        const imagePermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        );
        const videoPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
        );

        if (
          imagePermission === PermissionsAndroid.RESULTS.GRANTED &&
          videoPermission === PermissionsAndroid.RESULTS.GRANTED
        ) {
          return true;
        } else {
          console.log('미디어 접근 권한이 거부되었습니다.');
          return false;
        }
      } else {
        // Android 13 미만에서는 READ_EXTERNAL_STORAGE 요청
        const readGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
        const writeGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );

        if (
          readGranted === PermissionsAndroid.RESULTS.GRANTED &&
          writeGranted === PermissionsAndroid.RESULTS.GRANTED
        ) {
          return true;
        } else {
          console.log('파일 접근 권한이 거부되었습니다.');
          return false;
        }
      }
    }
    return true; // iOS의 경우 true 반환
  };

  // 이미지 선택 함수
  const handleImagePicker = async () => {
    const hasPermission = await requestPermission();
    if (hasPermission) {
      launchImageLibrary(
        {
          mediaType: 'photo',
          //   maxWidth: 300,
          //   maxHeight: 300,
          quality: 0.5,
        },
        async response => {
          console.log(response); // 응답 확인용 로그
          if (response.didCancel) {
            console.log('사용자가 이미지를 선택하지 않았습니다.');
          } else if (response.errorCode) {
            console.log('에러 발생:', response.errorMessage);
          } else if (response.assets && response.assets.length > 0) {
            const selectedAsset = response.assets[0];
            const {uri, fileName, type} = selectedAsset;

            if (uri && fileName && type) {
              setImageUri(uri);
              await uploadImageToS3({uri, fileName, type});
            } else {
              console.log('이미지 선택 오류', '유효한 이미지를 선택해 주세요.');
            }
          }
        },
      );
    } else {
      console.log('권한이 거부되었습니다.');
    }
  };

  // S3 업로드용 함수
  const uploadImageToS3 = async (image: UploadResponse) => {
    try {
      // 백엔드 서버에서 S3 업로드용 URL 가져오기
      const s3Url = await updateProfilePicture();

      console.log(image);
      // PUT 요청에 이미지 데이터 전송

      const response = await axios.put(
        s3Url,
        {
          uri: image.uri,
          name: image.fileName,
          type: image.type,
        },
        {
          headers: {
            'Content-Type': image.type, // S3에 요구되는 Content-Type 설정
          },
        },
      );

      if (response.status === 200) {
        Alert.alert('업로드 성공', '이미지가 S3에 업로드되었습니다.');
      } else {
        Alert.alert('업로드 실패', '이미지 업로드에 실패했습니다.');
      }
    } catch (error) {
      console.error('S3 업로드 오류:', error);
      Alert.alert('업로드 오류', 'S3 업로드 중 오류가 발생했습니다.');
    }
  };

  // 로그아웃 버튼
  const handleLogOut = async () => {
    try {
      await logOut(); //
      setAutoLogin(false);
      navigation.navigate('LoginScreen'); // 로그아웃 성공 시 로그인 페이지로 이동
      setCurrentScreen('LoginScreen');
    } catch (error) {
      console.error('로그아웃 실패:', error); // 로그아웃 실패 시 에러 처리
    }
  };

  // 비밀번호 변경 버튼
  const handleChangePassword = () => {
    open(<PasswordChangeModal />, {title: '비밀번호 변경'});
  };

  // 회원탈퇴 버튼
  const handleSignOut = () => {
    open(<SignOutModal />, {title: '정말 탈퇴하시겠습니까?'});
  };

  return (
    <View style={styles.container}>
      <ScreenInfo title="회원 정보" />
      <View style={styles.contentContainer}>
        <View style={styles.ImageContent}>
          <View style={styles.profileImageContainer}>
            {/* <Image
              style={styles.profileImage}
              source={
                authStore.userInfo && authStore.userInfo.image
                  ? {uri: authStore.userInfo.image} //
                  : defaultProfileImage // 
              }
            /> */}
          </View>
          <View></View>
          <TouchableOpacity
            style={styles.button}
            onPress={handleImagePicker}
            disabled={true}>
            <Text color="white" weight="bold">
              사진 변경(준비중)
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <Text variant="subtitle" weight="bold">
            이름
          </Text>
          <Text>{authStore.userInfo.name}</Text>
        </View>
        <View style={styles.content}>
          <Text variant="subtitle" weight="bold">
            소속
          </Text>
          <Text>
            {authStore.userInfo.classInfo.school}{' '}
            {authStore.userInfo.classInfo.grade}학년{' '}
            {authStore.userInfo.classInfo.classNumber}반
          </Text>
        </View>
        <View style={styles.content}>
          <Text variant="subtitle" weight="bold">
            생일
          </Text>
          <Text>{authStore.userInfo.birth}</Text>
        </View>
        <View style={styles.optionContainer}>
          <TouchableOpacity style={styles.button} onPress={handleLogOut}>
            <Text color="white" weight="bold">
              로그아웃
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={handleChangePassword}>
            <Text color="white" weight="bold">
              비밀번호 변경
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              {backgroundColor: colors.light.background.danger},
            ]}>
            <Text color="white" weight="bold" onPress={handleSignOut}>
              회원 탈퇴
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xxl,
  },
  contentContainer: {
    width: '100%',
    height: '92%',
    gap: spacing.xl,
  },
  ImageContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    gap: spacing.xl,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    backgroundColor: 'white',
    elevation: getResponsiveSize(1),
    borderRadius: borderRadius.md,
  },
  profileImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: iconSize.xxl,
    aspectRatio: 1,
    borderWidth: borderWidth.sm,
    borderColor: colors.light.borderColor.pickerBorder,
    borderRadius: 9999,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  content: {
    width: '100%',
    gap: spacing.xl,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    backgroundColor: 'white',
    elevation: getResponsiveSize(1),
    borderRadius: borderRadius.md,
  },
  button: {
    backgroundColor: colors.light.background.main,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
  },
  optionContainer: {
    gap: spacing.xl,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
