import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text } from '@components/common/Text';
import { useNavigation } from '@react-navigation/native';
import { spacing } from '@theme/spacing';
import { ScreenType } from '@store/useCurrentScreenStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import VerticalMenuIcon from '@assets/icons/verticalMenuIcon.svg';
import { iconSize } from '@theme/iconSize';
import UpdateLectureModal from './UpdateLectureModal';
import { useModal } from 'src/hooks/useModal';
import { deleteLecture } from '@services/lectureInformation';
import { useMutation } from '@tanstack/react-query';


type NavigationProps = NativeStackNavigationProp<ScreenType>;

type ClassHeaderProps = {
  isTeacher: boolean;
  lectureId?: number;
  title?: string;
  subtitle?: string;
  schedule?: { day: string; period: number }[];
  semester?: number;
  grade?: number;
  classNumber?: number;
  backgroundColor?: string;
  fontColor?: string;
  pastTeacherName?: string;
};

function ClassHeader({
  isTeacher,
  lectureId,
  title,
  subtitle,
  schedule,
  semester,
  grade,
  classNumber,
  backgroundColor,
  fontColor,
  pastTeacherName,
}: ClassHeaderProps): React.JSX.Element {
  const navigation = useNavigation<NavigationProps>();
  const { open } = useModal();

  const { mutate: deleteMutation } = useMutation({
    mutationFn: (deleteLectureId: number) => deleteLecture(deleteLectureId),
    onSuccess: () => {
      navigation.navigate('LectureListScreen');
    },
  });
  const showDeleteConfirmation = () => {
    Alert.alert(
      '경고',
      '정말 삭제하시겠습니까?',
      [
        {
          text: '삭제',
          onPress: () => {
            console.log('삭제 확정');
            // 삭제 작업 실행 코드
            deleteMutation(lectureId!);
          },
          style: 'destructive',
        },
        {
          text: '취소',
          style: 'cancel',
        },
      ],
      { cancelable: true },
    );
  };

  const showOptions = () => {
    Alert.alert(
      '수업 설정',
      '원하는 작업을 선택하세요.',
      [
        {
          text: '수정하기',
          onPress: () =>
            open(<UpdateLectureModal lectureId={lectureId!} grade={grade!} classNumber={classNumber!} pastTeacherName={pastTeacherName!} />, {
              title: '수업 생성',
              onClose: () => {
                console.log('수업 생성 모달 종료');
              },
            }),
        },
        {
          text: '삭제하기',
          onPress: showDeleteConfirmation, // 재확인 경고
          style: 'destructive',
        },
        {
          text: '취소',
          style: 'cancel',
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <View style={styles.header}>
      <View style={styles.titleSection}>
        <View style={styles.titleRow}>
          <Text style={styles.title} variant="title" weight="bold">
            {title || '수업 제목'}
          </Text>
          {grade && semester && (
            <View style={styles.gradeSemesterChip}>
              <Text style={styles.gradeSemesterText}>
                {grade}학년 - {semester}학기
              </Text>
            </View>
          )}
          {schedule?.map((item, index) => (
            <View
              key={index}
              style={[styles.scheduleChip, { backgroundColor: backgroundColor }]}>
              <Text style={[styles.scheduleChipText, { color: fontColor }]}>
                {item.day}
              </Text>
            </View>
          ))}
        </View>
        {subtitle && (
          <Text style={styles.subtitle} variant="subtitle">
            {subtitle}
          </Text>
        )}
      </View>
      <View style={styles.rightSection}>
        <TouchableOpacity
          style={styles.enterButton}
          onPress={() => navigation.navigate('LessoningStudentListScreen')}>
          <Text style={styles.enterButtonText}>수업 입장</Text>
        </TouchableOpacity>
        {isTeacher && (
          <TouchableOpacity
            style={styles.menuIconContainer}
            onPress={showOptions}>
            <VerticalMenuIcon width={iconSize.md} height={iconSize.md} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  titleSection: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginRight: spacing.sm,
  },
  gradeSemesterChip: {
    backgroundColor: '#4CAF50',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginLeft: spacing.sm,
  },
  gradeSemesterText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  scheduleChip: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginLeft: spacing.xs,
  },
  scheduleChipText: {
    fontSize: 12,
  },
  subtitle: {
    marginTop: spacing.xs,
    color: '#666',
    fontSize: 14,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  enterButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: spacing.lg,
  },
  enterButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  menuIconContainer: {
    marginLeft: spacing.sm,
    marginRight: spacing.xxl,
  },
});

export default ClassHeader;
