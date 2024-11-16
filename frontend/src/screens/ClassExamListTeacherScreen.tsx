import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { iconSize } from '@theme/iconSize';
import CalendarIcon from '@assets/icons/calendarIcon.svg';
import ClockIcon from '@assets/icons/clockIcon.svg';
import EmptyExamIcon from '@assets/icons/emptyExamIcon.svg';
import BackArrowIcon from '@assets/icons/backArrowIcon.svg';
import { Text as HeaderText } from '@components/common/Text';
import { useLessonStore } from '@store/useLessonStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getLectureDetail,
  LectureDetailType,
} from '@services/lectureInformation';
import { deleteExam } from '@services/examService';
import { ScreenType } from '@store/useCurrentScreenStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type NavigationProps = NativeStackNavigationProp<ScreenType>;

function ClassExamListTeacherScreen(): React.JSX.Element {
  const navigation = useNavigation<NavigationProps>();
  const queryClient = useQueryClient();
  const lectureId = useLessonStore(state => state.lectureId);

  const { data: lectureDetail } = useQuery<LectureDetailType>({
    queryKey: ['lectureDetail', lectureId],
    queryFn: () => getLectureDetail(lectureId!),
  });

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
    // 원하는 화면으로 이동할 때 examId 전달
    console.log(examId);

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
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <TouchableOpacity
                onPress={() => handleExamPress(item.examId)}
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
    marginVertical: 25,
    marginLeft: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 10,
  },
  card: {
    marginHorizontal: 24,
    padding: 20,
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: '#f1f1f1',
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
