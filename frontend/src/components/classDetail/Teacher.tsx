import React from 'react';
import {Text} from '@components/common/Text';
import {View, StyleSheet, ImageBackground} from 'react-native';
import {getResponsiveSize} from '@utils/responsive';
import {SvgUri} from 'react-native-svg';

type TeacherProps = {
  isTeacher: boolean;
  name?: string;
  telephone?: string;
  email?: string;
  photo: string;
};

function Teacher({
  name = '선생님 이름',
  telephone = '010-1234-5678',
  email = 'teacher@example.com',
  photo,
}: TeacherProps): React.JSX.Element {
  return (
    <View style={styles.teacher}>
      <View style={styles.header}>
        <Text variant="subtitle" weight="bold" style={styles.subtitle}>
          선생님 소개
        </Text>
      </View>
      <View style={styles.profileContainer}>
        <View style={styles.photoContainer}>
          {photo && photo.endsWith('.svg') ? (
            <SvgUri uri={photo} width="100%" height="100%" /> // 외부 SVG URL 사용
          ) : (
            <ImageBackground
              source={{uri: photo}}
              style={styles.photo}
              imageStyle={styles.photoImage}
            />
          )}
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>{name}</Text>
          <Text style={styles.infoText}>Tel. {telephone}</Text>
          <Text style={styles.infoText}>Email. {email}</Text>
          <Text style={styles.infoText}>
            열정적인 교육자로 성장과 소통을 추구합니다.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  teacher: {
    paddingVertical: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginStart: 25,
    marginBottom: 10,
  },
  subtitle: {
    fontWeight: 'bold',
  },
  pencilIcon: {
    marginLeft: 10,
    marginTop: 5,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    paddingHorizontal: 15,
  },
  photoContainer: {
    width: getResponsiveSize(112),
    height: getResponsiveSize(112),
    borderRadius: 100,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    width: getResponsiveSize(128),
    height: getResponsiveSize(128),
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoImage: {
    borderRadius: 100,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
  },
  infoText: {
    marginBottom: 5,
  },
});

export default Teacher;
