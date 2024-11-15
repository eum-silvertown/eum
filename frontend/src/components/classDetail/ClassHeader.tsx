import {View, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {Text} from '@components/common/Text';
import {useNavigation} from '@react-navigation/native';
import {ScreenType} from '@store/useCurrentScreenStore';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import VerticalMenuIcon from '@assets/icons/verticalMenuIcon.svg';
import {iconSize} from '@theme/iconSize';
import UpdateLectureModal from './UpdateLectureModal';
import {useModal} from 'src/hooks/useModal';
import {deleteLecture} from '@services/lectureInformation';
import {useMutation} from '@tanstack/react-query';

type NavigationProps = NativeStackNavigationProp<ScreenType>;

type ClassHeaderProps = {
  isTeacher: boolean;
  lectureId: number;
  title: string;
  subtitle: string;
  schedule: {day: string; period: number}[];
  semester: number;
  grade: number;
  classNumber: number;
  lectureStatus: boolean;
  backgroundColor: string;
  fontColor: string;
  pastTeacherName: string;
};

function ClassHeader({
  isTeacher,
  lectureId,
  title,
  subtitle,
  schedule,
  grade,
  classNumber,
  backgroundColor,
  fontColor,
  pastTeacherName,
  lectureStatus,
}: ClassHeaderProps): React.JSX.Element {
  const navigation = useNavigation<NavigationProps>();
  const {open} = useModal();

  const {mutate: deleteMutation} = useMutation({
    mutationFn: (deleteLectureId: number) => deleteLecture(deleteLectureId),
    onSuccess: () => {
      navigation.navigate('ClassListScreen');
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
            deleteMutation(lectureId);
          },
          style: 'destructive',
        },
        {
          text: '취소',
          style: 'cancel',
        },
      ],
      {cancelable: true},
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
            open(
              <UpdateLectureModal
                lectureId={lectureId}
                grade={grade}
                classNumber={classNumber}
                pastTeacherName={pastTeacherName}
              />,
              {
                title: '수업 수정',
                onClose: () => {
                  console.log('수업 수정 모달 종료');
                },
              },
            ),
        },
        {
          text: '삭제하기',
          onPress: showDeleteConfirmation,
          style: 'destructive',
        },
        {
          text: '취소',
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  };

  const enterClass = () => {
    if (lectureStatus) {
      if (isTeacher) {
        navigation.navigate('LessoningStudentListScreen');
      } else {
        navigation.navigate('LessoningScreen');
      }
    } else {
      Alert.alert('수업 종료됨', '이 수업은 종료되었습니다.');
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.titleSection}>
        <View style={styles.titleRow}>
          <Text style={styles.title} variant="title" weight="bold">
            {title || '수업 제목'}
          </Text>
          {grade && classNumber && (
            <View style={styles.gradeSemesterChip}>
              <Text style={styles.gradeSemesterText}>
                {grade}학년 - {classNumber}반
              </Text>
            </View>
          )}
          {schedule?.map((item, index) => (
            <View
              key={index}
              style={[styles.scheduleChip, {backgroundColor: backgroundColor}]}>
              <Text style={[styles.scheduleChipText, {color: fontColor}]}>
                {item.day} - {item.period}교시
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
          style={[
            styles.enterButton,
            !lectureStatus && styles.enterButtonDisabled,
            !isTeacher && styles.studentButton,
          ]}
          onPress={enterClass}
          disabled={!lectureStatus}>
          <Text
            style={[
              styles.enterButtonText,
              !lectureStatus && styles.enterButtonTextDisabled,
            ]}>
            {lectureStatus
              ? isTeacher
                ? '수업 재입장'
                : '수업 입장'
              : '수업 중이 아닙니다'}
          </Text>
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
    paddingHorizontal: 15,
    marginBottom: 5,
  },
  titleSection: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginRight: 5,
  },
  gradeSemesterChip: {
    backgroundColor: '#2e2559',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginLeft: 5,
  },
  gradeSemesterText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  scheduleChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 100,
    marginLeft: 3,
  },
  scheduleChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 3,
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
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 10,
    marginRight: 15,
  },
  enterButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  enterButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  enterButtonTextDisabled: {
    color: '#757575',
  },
  menuIconContainer: {
    marginLeft: 5,
    marginRight: 30,
  },
  studentButton: {
    marginRight: 45,
  },
});

export default ClassHeader;
