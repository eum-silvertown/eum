import React from 'react';
import { Text } from '@components/common/Text';
import { View, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { spacing } from '@theme/spacing';
import teacherPhoto from '@assets/images/teacher.png';
import PencilIcon from '@assets/icons/pencilIcon.svg';
import { iconSize } from '@theme/iconSize';

type IsTeacherProps = {
  isTeacher: boolean;
}

function Teacher({ isTeacher }: IsTeacherProps): React.JSX.Element {
  return (
    <View style={styles.teacher}>
      <View style={styles.header}>
        <Text variant="subtitle" weight="bold" style={styles.subtitle}>
          선생님 소개
        </Text>
        {isTeacher && (
          <TouchableOpacity style={styles.pencilIcon}>
            <PencilIcon width={iconSize.sm} height={iconSize.sm} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.profileContainer}>
        <View style={styles.photoContainer}>
          <ImageBackground
            source={teacherPhoto}
            style={styles.photo}
            imageStyle={styles.photoImage}
          />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Tel. 010-1234-5678</Text>
          <Text style={styles.infoText}>Email. teacher@example.com</Text>
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
