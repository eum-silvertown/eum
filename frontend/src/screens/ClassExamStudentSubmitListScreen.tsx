import React, { useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useLectureStore, useLessonStore } from '@store/useLessonStore';
import { useQuery } from '@tanstack/react-query';
import {
  getStudentExamSubmissionList,
  StudentExamSubmissionListResponse,
} from '@services/examService';
import BackArrowIcon from '@assets/icons/backArrowIcon.svg';
import { Text as HeaderText } from '@components/common/Text';

function ClassExamStudentSubmitListScreen(): React.JSX.Element {
  const route = useRoute();
  const navigation = useNavigation();
  const { examId } = route.params as { examId: number };
  const lectureId = useLessonStore((state) => state.lectureId);
  const studentsCnt = useLectureStore((state) => state.lectureStudents);

  const { data: submissions, isLoading, isError } = useQuery<StudentExamSubmissionListResponse>({
    queryKey: ['examSubmissions', lectureId, examId],
    queryFn: () => getStudentExamSubmissionList(lectureId!, examId),
  });

  const summaryData = useMemo(() => {
    if (!submissions || submissions.length === 0) {
      return {
        totalSubmissions: 0,
        unsubmitted: studentsCnt || 0,
        averageScore: 0,
      };
    }

    const totalSubmissions = submissions.length;
    const averageScore = Math.floor(
      submissions.reduce((sum, submission) => sum + submission.score, 0) / totalSubmissions
    );
    const unsubmitted = (studentsCnt || 0) - totalSubmissions;

    return {
      totalSubmissions,
      unsubmitted,
      averageScore,
    };
  }, [submissions, studentsCnt]);

  const renderSubmissionItem = ({ item }: { item: StudentExamSubmissionListResponse[0] }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.studentImage }}
        style={styles.studentImage}
        resizeMode="cover"
      />
      <View style={styles.infoContainer}>
        <Text style={styles.studentName}>{item.studentName}</Text>
        <Text style={styles.itemText}>점수: {item.score.toFixed(0)}점</Text>
        <Text style={styles.itemText}>
          전체 {item.totalCount}문제 중 {item.correctCount}문제 맞혔습니다.
        </Text>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>시험 제출 내역을 불러오는 중입니다...</Text>
      </View>
    );
  }

  if (isError || !submissions) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>제출 내역을 가져오는 데 실패했습니다.</Text>
      </View>
    );
  }

  if (submissions.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <BackArrowIcon />
          </TouchableOpacity>
          <HeaderText variant="title" style={styles.headerText} weight="bold">
            시험 제출 내역
          </HeaderText>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>제출 내역이 없습니다.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackArrowIcon />
        </TouchableOpacity>
        <HeaderText variant="title" style={styles.headerText} weight="bold">
          시험 제출 내역
        </HeaderText>
      </View>
      <View style={styles.summaryContainer}>
        <View style={[styles.chip, { backgroundColor: '#E3F2FD' }]}>
          <Text style={[styles.chipText, { color: '#2196F3' }]}>
            제출 인원: {summaryData.totalSubmissions}명
          </Text>
        </View>
        <View style={[styles.chip, { backgroundColor: '#FFEBEE' }]}>
          <Text style={[styles.chipText, { color: '#F44336' }]}>
            미제출 인원: {summaryData.unsubmitted}명
          </Text>
        </View>
        <View style={[styles.chip, { backgroundColor: '#FFF4E3' }]}>
          <Text style={[styles.chipText, { color: '#FFA000' }]}>
            평균 점수: {summaryData.averageScore}점
          </Text>
        </View>
      </View>
      <FlatList
        data={submissions}
        keyExtractor={(item) => item.examSubmissionId.toString()}
        renderItem={renderSubmissionItem}
        contentContainerStyle={styles.listContainer}
        style={styles.flatListContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#FFF',
  },
  header: {
    marginVertical: 18,
    marginLeft: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 10,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 24,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
    elevation: 0.5,
  },
  chipText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 10,
  },
  flatListContainer: {
    marginHorizontal: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
  },
  studentImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    backgroundColor: '#EEE',
  },
  infoContainer: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  itemText: {
    fontSize: 14,
    color: '#000',
    marginBottom: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
  },
});

export default ClassExamStudentSubmitListScreen;
