import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { iconSize } from '@theme/iconSize';
import CalendarIcon from '@assets/icons/calendarIcon.svg';
import ClockIcon from '@assets/icons/clockIcon.svg';
import EmptyExamIcon from '@assets/icons/emptyExamIcon.svg';
import BackArrowIcon from '@assets/icons/backArrowIcon.svg';
import { Text as HeaderText } from '@components/common/Text';
import { useAuthStore } from '@store/useAuthStore';
import { useLessonStore } from '@store/useLessonStore';
import { useQuery } from '@tanstack/react-query';
import {
  getLectureDetail,
  LectureDetailType,
} from '@services/lectureInformation';
import { getExamSubmissionList } from '@services/examService';
import { ScreenType } from '@store/useCurrentScreenStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useExamStore } from '@store/useExamStore';

type NavigationProps = NativeStackNavigationProp<ScreenType>;

function ClassExamListScreen(): React.JSX.Element {
  const navigation = useNavigation<NavigationProps>();
  const lectureId = useLessonStore(state => state.lectureId);
  const studentId = useAuthStore(state => state.userInfo.id);
  const { setExams } = useExamStore();

  const { data: lectureDetail } = useQuery<LectureDetailType>({
    queryKey: ['lectureDetail', lectureId],
    queryFn: () => getLectureDetail(lectureId!),
  });
  const { data: examSubmissions } = useQuery({
    queryKey: ['examSubmissionList', lectureId, studentId],
    queryFn: () => getExamSubmissionList(lectureId!, studentId!),
  });

  useEffect(() => {
    if (lectureDetail?.exams) {
      setExams(lectureDetail.exams);
    }
  }, [lectureDetail?.exams, setExams]);

  const [selectedFilter, setSelectedFilter] = useState<string>('전체');
  const [currentTime, setCurrentTime] = useState<Date>(new Date()); // 현재 시간 상태

  // 1초마다 현재 시간 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleExamPress = (exam: any) => {
    const endTime = new Date(exam.endTime).getTime();
    const nowTime = Date.now();

    if (exam.isSubmitted) {
      // 제출된 시험 -> 결과 화면으로 이동
      navigation.navigate('ConfirmSolvedScreen', {
        typeId: exam.examId,
        questionIds: exam.questions,
        solvedType: 'EXAM',
      });
    } else if (nowTime <= endTime) {
      // 기한 내 미제출 -> 시험 풀이 화면으로 이동
      navigation.navigate('SolveExamScreen', {
        examId: exam.examId,
        questionIds: exam.questions,
      });
    } else {
      // 기한 지난 미제출 -> 알림
      Alert.alert('알림', '기한이 지난 시험은 제출할 수 없습니다.');
    }
  };


  const submittedExamIds = examSubmissions?.map(
    submission => submission.examId,
  );

  const filteredExams = [...(lectureDetail?.exams || [])]
    .map((exam) => {
      const isSubmitted = submittedExamIds?.includes(exam.examId) || false;
      const startTime = new Date(exam.startTime);
      const endTime = new Date(exam.endTime);
      const now = currentTime.getTime();

      const isOngoing = now >= startTime.getTime() && now <= endTime.getTime();
      const isPastDeadline = !isSubmitted && endTime.getTime() < now;
      const remainingTime = Math.max(0, endTime.getTime() - now);

      const remainingMinutes = Math.floor((remainingTime / 1000) / 60); // 남은 분
      const remainingSeconds = Math.floor((remainingTime / 1000) % 60); // 남은 초

      return {
        ...exam,
        isSubmitted,
        isOngoing,
        isPastDeadline,
        remainingMinutes,
        remainingSeconds,
      };
    })
    .filter((exam) => {
      switch (selectedFilter) {
        case '기한 내 미제출':
          return !exam.isSubmitted && !exam.isPastDeadline;
        case '기한 지난 미제출':
          return !exam.isSubmitted && exam.isPastDeadline;
        case '기한 내 제출':
          return exam.isSubmitted; // 기한 내 제출과 기한 지난 제출을 통합
        default: // 전체
          return true;
      }
    })
    .sort((a, b) => {
      if (selectedFilter === '전체') {
        // 전체 필터의 경우 진행 중인 시험을 우선적으로 정렬
        if (a.isOngoing && !b.isOngoing) {
          return -1;
        }
        if (!a.isOngoing && b.isOngoing) {
          return 1;
        }
      }
      // 기본 정렬 기준은 시작 시간 순서
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
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
        <View style={styles.filterContainer}>
          <Picker
            selectedValue={selectedFilter}
            onValueChange={itemValue => setSelectedFilter(itemValue)}
            style={styles.filterPicker}>
            <Picker.Item label="전체" value="전체" />
            <Picker.Item label="기한 내 미제출" value="기한 내 미제출" />
            <Picker.Item label="기한 지난 미제출" value="기한 지난 미제출" />
            <Picker.Item label="기한 내 제출" value="기한 내 제출" />
          </Picker>
        </View>
      </View>
      <FlatList
        data={filteredExams}
        keyExtractor={(item) => item.examId.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              item.isPastDeadline
                ? styles.pastDeadlineCard
                : item.isSubmitted
                  ? styles.submittedCard
                  : styles.ongoingExamCard,
            ]}
          >
            <View style={styles.cardContent}>
              <TouchableOpacity
                onPress={() => handleExamPress(item)}
                style={styles.examContent}
              >
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
                      남은 시간: {item.remainingMinutes}분 {item.remainingSeconds}초
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
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
            <Text style={styles.emptyText}>시험이 없습니다.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#FFF' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  card: {
    marginHorizontal: 40,
    padding: 20,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  ongoingExamCard: {
    backgroundColor: '#f1f1f1', // 진행 중인 시험 배경색
  },
  submittedCard: {
    backgroundColor: '#D8E1FE', // 제출된 숙제 배경색
    borderLeftWidth: 5,
    borderLeftColor: '#4CAF50',
  },
  pastDeadlineCard: {
    backgroundColor: '#F8D7DA', // 기한이 지난 숙제 배경색
    borderLeftWidth: 5,
    borderLeftColor: '#FF5555',
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
  itemTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginLeft: 5 },
  itemText: { fontSize: 14, color: '#666', marginBottom: 3 },
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
  filterContainer: {
    marginLeft: 'auto',
    marginRight: 24,
    width: 150,
  },
  filterPicker: {
    height: 20,
  },
});

export default ClassExamListScreen;
