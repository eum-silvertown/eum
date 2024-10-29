import React from 'react';
import { Text } from '@components/common/Text';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { spacing } from '@theme/spacing';
import teacherPhoto from '@assets/images/teacher.png';

function Teacher(): React.JSX.Element {
  return (
    <View style={styles.teacher}>
      <Text variant="subtitle" weight="bold" style={styles.subtitle}>
        선생님 소개
      </Text>
      <View style={styles.profileContainer}>
        <View style={styles.photoContainer}>
          <ImageBackground source={teacherPhoto} style={styles.photo} imageStyle={styles.photoImage} />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>전화번호: 010-1234-5678</Text>
          <Text style={styles.infoText}>이메일: teacher@example.com</Text>
          <Text style={styles.infoText}>한줄 소개: 열정적인 교육자로 성장과 소통을 추구합니다.</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  teacher: {
    paddingVertical: spacing.lg,
  },
  subtitle: {
    marginStart: spacing.xl,
    marginBottom: spacing.md,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  photoContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoImage: {
    borderRadius: 45,
  },
  infoContainer: {
    flex: 1,
    marginLeft: spacing.md,
  },
  infoText: {
    marginBottom: spacing.xs,
  },
});

export default Teacher;
