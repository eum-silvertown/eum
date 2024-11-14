import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import React, {useEffect} from 'react';
import {launchImageLibrary} from 'react-native-image-picker';

import {Text} from '@components/common/Text';
import ScreenInfo from '@components/common/ScreenInfo';
import {borderRadius} from '@theme/borderRadius';
import {colors} from 'src/hooks/useColors';
import defaultProfileImage from '@assets/images/defaultProfileImage.png';
import {iconSize} from '@theme/iconSize';
import {borderWidth} from '@theme/borderWidth';
import {
  getUserInfo,
  updateProfilePicture,
  logOut,
  deleteProfileImage,
} from '@services/authService';
import {useAuthStore} from '@store/useAuthStore';
import axios from 'axios';

import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScreenType, useCurrentScreenStore} from '@store/useCurrentScreenStore';

import {useModal} from 'src/hooks/useModal';
import PasswordChangeModal from '@components/account/PasswordChangeModal';
import SignOutModal from '@components/account/SignOutModal';
import {setAutoLogin} from '@utils/secureStorage';
import ConfirmationModal from '@components/common/ConfirmationModal';

type NavigationProps = NativeStackNavigationProp<ScreenType>;

interface UploadResponse {
  uri: string;
  fileName: string;
  type: string;
}

export default function ProfileScreen(): React.JSX.Element {
  const navigation = useNavigation<NavigationProps>();
  const {setCurrentScreen} = useCurrentScreenStore();
  const {open} = useModal();
  const authStore = useAuthStore();

  // 유저 정보 호출
  const fetchUserInfo = async () => {
    try {
      await getUserInfo();
    } catch (error) {}
  };

  useEffect(() => {
    fetchUserInfo(); // 함수 호출
  }, []);

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
          maxWidth: 300,
          maxHeight: 300,
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

  const uploadImageToS3 = async (image: UploadResponse) => {
    try {
      // 백엔드에서 전달받은 S3 업로드용 URL
      const s3Url = await updateProfilePicture();
      console.log('업로드용 S3 URL:', s3Url);

      // 이미지 파일을 blob 형태로 가져오기
      const response = await fetch(image.uri);
      const blob = await response.blob();

      // axios를 사용한 S3 업로드
      const uploadResponse = await axios.put(s3Url, blob, {
        headers: {
          'Content-Type': image.type,
        },
        // axios가 데이터를 그대로 전송하도록 설정
        transformRequest: [data => data],
      });

      if (uploadResponse.status === 200) {
        getUserInfo();
        Alert.alert('변경 완료', '프로필 이미지가 변경 되었습니다.');
      } else {
        Alert.alert('업로드 실패', '이미지 업로드에 실패했습니다.');
      }
    } catch (error) {
      console.error('S3 업로드 오류:', error);
      Alert.alert('업로드 오류', '이미지 업로드 중 오류가 발생했습니다.');
    }
  };

  // 로그아웃 버튼
  const handleLogOut = async () => {
    try {
      await logOut(); //
      setAutoLogin(false);

      setCurrentScreen('LoginScreen');
      // 내비게이션 스택을 초기화하여 로그인 화면으로 이동
      navigation.reset({
        index: 0,
        routes: [{name: 'LoginScreen'}],
      });
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

  const handleProfileImageDelete = () => {
    open(
      <ConfirmationModal
        onConfirm={async () => {
          try {
            await deleteProfileImage(); // 프로필 이미지 삭제
            getUserInfo();
            Alert.alert('삭제 완료', '프로필 이미지가 삭제되었습니다.');
          } catch (error) {
            console.error('프로필 이미지 삭제 오류:', error);
            Alert.alert(
              '삭제 오류',
              '프로필 이미지 삭제 중 오류가 발생했습니다.',
            );
          }
        }}
        onCancel={() => {
          console.log('삭제 취소됨');
        }}
      />,
      {title: '정말 삭제하시겠습니까?'},
    );
  };

  return (
    <View style={styles.container}>
      <ScreenInfo title="회원 정보" />
      <View style={styles.contentContainer}>
        <View style={styles.ImageContent}>
          <View style={styles.profileImageContainer}>
            <Image
              style={styles.profileImage}
              source={
                authStore.userInfo && authStore.userInfo.image
                  ? {uri: authStore.userInfo.image.url}
                  : defaultProfileImage
              }
            />
          </View>
          <View style={styles.profileImageOptions}>
            <TouchableOpacity style={styles.button} onPress={handleImagePicker}>
              <Text color="white" weight="bold">
                프로필 사진 변경하기
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                {backgroundColor: colors.light.background.danger},
              ]}
              onPress={handleProfileImageDelete}>
              <Text color="white" weight="bold">
                프로필 사진 삭제하기
              </Text>
            </TouchableOpacity>
          </View>
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
    paddingVertical: 25,
    paddingHorizontal: 40,
    backgroundColor: '#fff',
  },
  contentContainer: {
    width: '100%',
    height: '92%',
    gap: 25,
  },
  ImageContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    gap: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    backgroundColor: 'white',
    elevation: 2,
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
    gap: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    backgroundColor: 'white',
    elevation: 2,
    borderRadius: borderRadius.md,
  },
  button: {
    backgroundColor: colors.light.background.main,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: borderRadius.md,
  },
  optionContainer: {
    gap: 25,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  profileImageOptions: {
    gap: 15,
  },
});
