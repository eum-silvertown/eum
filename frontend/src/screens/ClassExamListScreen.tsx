import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import {spacing} from '@theme/spacing';
import {useNavigation} from '@react-navigation/native';
import {iconSize} from '@theme/iconSize';
import CalendarIcon from '@assets/icons/calendarIcon.svg';
import EmptyExamIcon from '@assets/icons/emptyExamIcon.svg';
import BackArrowIcon from '@assets/icons/backArrowIcon.svg';
import {Text as HeaderText} from '@components/common/Text';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useLessonStore} from '@store/useLessonStore';
import {
  LectureDetailType,
  getLectureDetail,
} from '@services/lectureInformation';
import {useAuthStore} from '@store/useAuthStore';
import {deleteExam} from '@services/examService';

const ClassExamListScreen = () => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const lectureId = useLessonStore(state => state.lectureId);
  const role = useAuthStore(state => state.userInfo.role);

  const {data: lectureDetail} = useQuery<LectureDetailType>({
    queryKey: ['lectureDetail', lectureId],
    queryFn: () => getLectureDetail(lectureId!),
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

  const handleExamPress = (examId: number) => {
    console.log('examId:', examId);

    // navigation.navigate('ExamDetail', { examId });
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

  const exams = lectureDetail?.exams || [];

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
        data={exams}
        keyExtractor={item => item.examId.toString()}
        renderItem={({item}) => (
          <View style={styles.item}>
            <View style={styles.itemContent}>
              <TouchableOpacity
                onPress={() => handleExamPress(item.examId)}
                style={styles.itemHeader}>
                <CalendarIcon width={iconSize.sm} height={iconSize.sm} />
                <Text style={styles.itemTitle}>{item.title}</Text>
              </TouchableOpacity>
              <Text style={styles.itemText}>
                시작 시간: {new Date(item.startTime).toLocaleString()}
              </Text>
              <Text style={styles.itemText}>
                종료 시간: {new Date(item.endTime).toLocaleString()}
              </Text>
              <Text style={styles.itemText}>
                문제 개수: {item.questions.length}
              </Text>
            </View>
            {role === 'TEACHER' && (
              <TouchableOpacity
                onPress={() => handleDeleteExam(item.examId)}
                style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>삭제하기</Text>
              </TouchableOpacity>
            )}
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
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: spacing.lg, backgroundColor: '#FFF'},
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    color: '#333',
  },
  item: {
    marginHorizontal: spacing.xxl,
    padding: spacing.xl,
    backgroundColor: '#F9E1E1',
    marginBottom: spacing.md,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: spacing.sm,
  },
  itemText: {fontSize: 14, color: '#666', marginBottom: spacing.xs},
  deleteButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
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
    paddingTop: spacing.xxl,
  },
  emptyIcon: {
    marginBottom: spacing.lg,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  header: {
    marginVertical: spacing.xl,
    marginLeft: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: spacing.md,
  },
});

export default ClassExamListScreen;
