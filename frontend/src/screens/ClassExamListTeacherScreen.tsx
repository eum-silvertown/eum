import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { iconSize } from '@theme/iconSize';
import CalendarIcon from '@assets/icons/calendarIcon.svg';
import ClockIcon from '@assets/icons/clockIcon.svg';
import EmptyExamIcon from '@assets/icons/emptyExamIcon.svg';
import BackArrowIcon from '@assets/icons/backArrowIcon.svg';
import { Text as HeaderText } from '@components/common/Text';
import { useLessonStore } from '@store/useLessonStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLectureDetail, LectureDetailType } from '@services/lectureInformation';
import { deleteExam } from '@services/examService';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenType } from '@store/useCurrentScreenStore';

type NavigationProps = NativeStackNavigationProp<ScreenType>;

function ClassExamListTeacherScreen(): React.JSX.Element {
  const navigation = useNavigation<NavigationProps>();
  const queryClient = useQueryClient();
  const lectureId = useLessonStore(state => state.lectureId);

  const { data: lectureDetail } = useQuery<LectureDetailType>({
    queryKey: ['lectureDetail', lectureId],
    queryFn: () => getLectureDetail(lectureId!),
  });

  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const { mutate: removeExam } = useMutation({
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

  const handleExamPress = (examId: number) => {
    navigation.navigate('ClassExamStudentSubmitListScreen', { examId });
  };

  const exams = (lectureDetail?.exams || []).map(exam => {
    const startTime = new Date(exam.startTime);
    const endTime = new Date(exam.endTime);
    const now = currentTime.getTime();

    const isBeforeStart = now < startTime.getTime();
    const isOngoing = now >= startTime.getTime() && now <= endTime.getTime();
    const isAfterEnd = now > endTime.getTime();

    const remainingTime = Math.max(0, endTime.getTime() - now);
    const remainingHours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
    const remainingMinutes = Math.floor((remainingTime / (1000 * 60)) % 60);
    const remainingSeconds = Math.floor((remainingTime / 1000) % 60);

    const examDuration = Math.round(
      (endTime.getTime() - startTime.getTime()) / (1000 * 60),
    );

    return {
      ...exam,
      isBeforeStart,
      isOngoing,
      isAfterEnd,
      remainingHours,
      remainingMinutes,
      remainingSeconds,
      examDuration, // 시험 시간 추가
    };
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
        data={exams.sort((a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime())}
        keyExtractor={item => item.examId.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              item.isBeforeStart
                ? styles.beforeStartCard
                : item.isOngoing
                  ? styles.ongoingCard
                  : styles.afterEndCard,
            ]}>
            <View style={styles.cardContent}>
              <TouchableOpacity
                onPress={() => handleExamPress(item.examId)}
                style={styles.examContent}>
                <View style={styles.textContainer}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <View style={styles.iconRow}>
                    <CalendarIcon width={iconSize.sm} height={iconSize.sm} />
                    <Text style={styles.itemText}>
                      시작 시간: {new Date(item.startTime).toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.iconRow}>
                    <CalendarIcon width={iconSize.sm} height={iconSize.sm} />
                    <Text style={styles.itemText}>
                      종료 시간: {new Date(item.endTime).toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.iconRow}>
                    <ClockIcon width={iconSize.sm} height={iconSize.sm} />
                    <Text style={styles.itemText}>
                      시험 시간: {item.examDuration}분
                    </Text>
                  </View>
                  {item.isOngoing && (
                    <Text style={styles.remainingTimeText}>
                      남은 시간: {item.remainingHours}시간 {item.remainingMinutes}분{' '}
                      {item.remainingSeconds}초
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteExam(item.examId)}
                style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>삭제하기</Text>
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
  header: {
    marginVertical: 18,
    marginLeft: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 10,
  },
  card: {
    marginHorizontal: 40,
    padding: 25,
    marginBottom: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  beforeStartCard: {
    backgroundColor: '#FFDDFF', // 시작 전 배경색
  },
  ongoingCard: {
    backgroundColor: '#FFFFDD', // 시험 중 배경색
  },
  afterEndCard: {
    backgroundColor: '#DDFFDD', // 종료 후 배경색
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
});

export default ClassExamListTeacherScreen;
