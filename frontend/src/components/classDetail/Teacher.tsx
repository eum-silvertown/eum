import React from 'react';
import { Text } from '@components/common/Text';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { spacing } from '@theme/spacing';
import { getResponsiveSize } from '@utils/responsive';
import { SvgUri } from 'react-native-svg';

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
              source={{ uri: photo }}
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
    paddingVertical: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginStart: spacing.xl,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontWeight: 'bold',
  },
  pencilIcon: {
    marginLeft: spacing.md,
    marginTop: spacing.sm,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  photoContainer: {
    width: getResponsiveSize(70),
    height: getResponsiveSize(70),
    borderRadius: 100,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    width: getResponsiveSize(80),
    height: getResponsiveSize(80),
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoImage: {
    borderRadius: 100,
  },
  infoContainer: {
    flex: 1,
    marginLeft: spacing.md,
  },
  infoText: {
    marginBottom: spacing.sm,
  },
});

export default Teacher;
