import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
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
import {updateProfilePicture} from '@services/authService';
import {useAuthStore} from '@store/useAuthStore';
import axios from 'axios';

interface UploadResponse {
  uri: string;
  fileName: string;
  type: string;
}

export default function ProfileScreen(): React.JSX.Element {
  const [imageUri, setImageUri] = useState<string | null>(null);

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
    
        // FormData에 이미지 파일 추가
        const formData = new FormData();
        formData.append('file', {
          uri: image.uri,
          name: image.fileName,
          type: image.type,
        });
    
        // PUT 요청을 통해 FormData를 S3에 업로드
        const response = await axios.put(s3Url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
    
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
  const handleLogOut = () => {};

  // 비밀번호 변경 버튼
  const handleChangePassword = () => {};

  return (
    <View style={styles.container}>
      <ScreenInfo title="회원 정보" />
      <View style={styles.contentContainer}>
        <View style={styles.ImageContent}>
          <View style={styles.profileImageContainer}>
            <Image style={styles.profileImage} source={defaultProfileImage} />
          </View>
          <View></View>
          <TouchableOpacity style={styles.button} onPress={handleImagePicker}>
            <Text color="white" weight="bold">
              사진 변경
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <Text variant="subtitle" weight="bold">
            이름
          </Text>
          <Text>박효진</Text>
        </View>
        <View style={styles.content}>
          <Text variant="subtitle" weight="bold">
            소속
          </Text>
          <Text>OOOO학교 1학년 1반</Text>
        </View>
        <View style={styles.content}>
          <Text variant="subtitle" weight="bold">
            생일
          </Text>
          <Text>2024년 1월 1일</Text>
        </View>
        <View style={styles.optionContainer}>
          <TouchableOpacity style={styles.button}>
            <Text color="white" weight="bold">
              로그아웃
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text color="white" weight="bold">
              비밀번호 변경
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              {backgroundColor: colors.light.background.danger},
            ]}>
            <Text color="white" weight="bold">
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
