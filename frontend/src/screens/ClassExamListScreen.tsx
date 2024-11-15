import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {iconSize} from '@theme/iconSize';
import CalendarIcon from '@assets/icons/calendarIcon.svg';
import ClockIcon from '@assets/icons/clockIcon.svg';
import EmptyExamIcon from '@assets/icons/emptyExamIcon.svg';
import BackArrowIcon from '@assets/icons/backArrowIcon.svg';
import {Text as HeaderText} from '@components/common/Text';
import {useAuthStore} from '@store/useAuthStore';
import {useLessonStore} from '@store/useLessonStore';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {
  getLectureDetail,
  LectureDetailType,
} from '@services/lectureInformation';
import {deleteExam, getExamSubmissionList} from '@services/examService';
import {ScreenType} from '@store/useCurrentScreenStore';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
type NavigationProps = NativeStackNavigationProp<ScreenType>;

function ClassExamListScreen(): React.JSX.Element {
  const navigation = useNavigation<NavigationProps>();
  const queryClient = useQueryClient();
  const lectureId = useLessonStore(state => state.lectureId);
  const role = useAuthStore(state => state.userInfo.role);
  const studentId = useAuthStore(state => state.userInfo.id);

  const {data: lectureDetail} = useQuery<LectureDetailType>({
    queryKey: ['lectureDetail', lectureId],
    queryFn: () => getLectureDetail(lectureId!),
  });

  const {data: examSubmissions} = useQuery({
    queryKey: ['examSubmissionList', lectureId, studentId],
    queryFn: () => getExamSubmissionList(lectureId!, studentId!),
  });

  const {mutate: removeExam} = useMutation({
    mutationFn: (examId: number) => deleteExam(examId),
    onSuccess: () => {
      Alert.alert('알림', '시험이 삭제되었습니다.');
      queryClient.invalidateQueries({
        queryKey: ['lectureDetail', lectureId],
      });
    },
    onError: error => {
      console.error('시험 삭제 실패:', error);
    },
  });

  const handleExamPress = (examId: number, questionIds: number[]) => {
    navigation.navigate('SolveExamScreen', {examId, questionIds});
  };

  const handleDeleteExam = (examId: number) => {
    Alert.alert('시험 삭제', '이 시험을 정말로 삭제하시겠습니까?', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '삭제',
        onPress: () => removeExam(examId),
        style: 'destructive',
      },
    ]);
  };

  const submittedExamIds = examSubmissions?.map(
    submission => submission.examId,
  );

  const sortedExams = [...(lectureDetail?.exams || [])]
    .map(exam => {
      const isSubmitted = submittedExamIds?.includes(exam.examId) || false;
      const endTime = new Date(exam.endTime);
      const currentTime = Date.now();
      const isPastDeadline = !isSubmitted && endTime.getTime() < currentTime;
      const remainingTime = Math.max(0, endTime.getTime() - currentTime);

      const remainingHours = Math.floor(
        (remainingTime / (1000 * 60 * 60)) % 24,
      );
      const remainingMinutes = Math.floor((remainingTime / (1000 * 60)) % 60);
      const remainingSeconds = Math.floor((remainingTime / 1000) % 60);

      return {
        ...exam,
        isSubmitted,
        isPastDeadline,
        remainingHours,
        remainingMinutes,
        remainingSeconds,
      };
    })
    .sort((a, b) => {
      if (a.isSubmitted === b.isSubmitted) {
        return (
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        );
      }
      return a.isSubmitted ? 1 : -1;
    });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackArrowIcon />
        </TouchableOpacity>
        <HeaderText variant="title" style={styles.headerText} weight="bold">
          시험 목록
        </HeaderText>
      </View>
      <FlatList
        data={sortedExams}
        keyExtractor={item => item.examId.toString()}
        renderItem={({item}) => (
          <View
            style={[
              styles.card,
              item.isPastDeadline
                ? styles.pastDeadlineCard
                : item.isSubmitted
                ? styles.submittedCard
                : styles.ongoingExamCard,
            ]}>
            <View style={styles.cardContent}>
              <TouchableOpacity
                onPress={() => handleExamPress(item.examId, item.questions)}
                style={styles.examContent}>
                <CalendarIcon
                  width={iconSize.md}
                  height={iconSize.md}
                  style={styles.icon}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <View style={styles.iconRow}>
                    <ClockIcon width={iconSize.sm} height={iconSize.sm} />
                    <Text style={styles.itemText}>
                      시작 시간: {new Date(item.startTime).toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.iconRow}>
                    <ClockIcon width={iconSize.sm} height={iconSize.sm} />
                    <Text style={styles.itemText}>
                      종료 시간: {new Date(item.endTime).toLocaleString()}
                    </Text>
                  </View>
                  <Text style={styles.itemText}>
                    문제 개수: {item.questions.length}
                  </Text>
                  {!item.isSubmitted && !item.isPastDeadline && (
                    <Text style={styles.remainingTimeText}>
                      남은 시간: {item.remainingHours}시간{' '}
                      {item.remainingMinutes}분 {item.remainingSeconds}초
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
              {role === 'TEACHER' && (
                <TouchableOpacity
                  onPress={() => handleDeleteExam(item.examId)}
                  style={styles.deleteButton}>
                  <Text style={styles.deleteButtonText}>삭제하기</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <EmptyExamIcon
              width={iconSize.xxl * 7}
              height={iconSize.xxl * 7}
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyText}>현재 등록된 시험이 없습니다.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 15, backgroundColor: '#FFF'},
  title: {fontSize: 22, fontWeight: 'bold', marginBottom: 10, color: '#333'},
  card: {
    marginHorizontal: 24,
    padding: 20,
    marginBottom: 12,
    borderRadius: 10,
  },
  notSubmittedCard: {
    backgroundColor: '#FFDDDD', // 시간 오버 + 제출 못한 시험 배경색
  },
  ongoingExamCard: {
    backgroundColor: '#FFFFFF', // 진행 중인 시험 배경색
  },
  submittedCard: {
    backgroundColor: '#DDFFDD', // 시간 내 제출한 시험 배경색
  },
  pastDeadlineCard: {
    backgroundColor: '#FFDDDD', // 시간 오버된 시험 배경색
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  examContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  itemTitle: {fontSize: 18, fontWeight: 'bold', color: '#333', marginLeft: 5},
  itemText: {fontSize: 14, color: '#666', marginBottom: 3},
  remainingTimeText: {
    color: '#FFA500',
    fontWeight: 'bold',
    marginTop: 5,
  },
  deleteButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#FF5555',
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyIcon: {
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  header: {
    marginVertical: 25,
    marginLeft: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 10,
  },
});

export default ClassExamListScreen;
