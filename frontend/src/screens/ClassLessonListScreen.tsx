import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { iconSize } from '@theme/iconSize';
import { useNavigation } from '@react-navigation/native';
import LessonIcon from '@assets/icons/lessonIcon.svg';
import EmptyLessonIcon from '@assets/icons/emptyLessonIcon.svg';
import BackArrowIcon from '@assets/icons/backArrowIcon.svg';
import { Text as HeaderText } from '@components/common/Text';
import { useAuthStore } from '@store/useAuthStore';
import { useLessonStore } from '@store/useLessonStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getLectureDetail,
  LectureDetailType,
} from '@services/lectureInformation';
import { deleteLesson } from '@services/lessonService';
import { ScreenType } from '@store/useCurrentScreenStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type NavigationProps = NativeStackNavigationProp<ScreenType>;

function ClassLessonListScreen(): React.JSX.Element {
  const navigation = useNavigation<NavigationProps>();
  const queryClient = useQueryClient();
  const lectureId = useLessonStore(state => state.lectureId);
  const role = useAuthStore(state => state.userInfo.role);

  const { data: lectureDetail } = useQuery<LectureDetailType>({
    queryKey: ['lectureDetail', lectureId],
    queryFn: () => getLectureDetail(lectureId!),
  });

  const { mutate: removeLesson } = useMutation({
    mutationFn: (lessonId: number) => deleteLesson(lessonId),
    onSuccess: () => {
      Alert.alert('알림', '삭제되었습니다.');
      queryClient.invalidateQueries({
        queryKey: ['lectureDetail', lectureId],
      });
    },
    onError: error => {
      console.error('레슨 삭제 실패:', error);
    },
  });

  const handleLessonPress = (lessonId: number, questionIds: number[]) => {
    navigation.navigate('ClassLessonReviewScreen', { lessonId, questionIds });
  };

  const handleDeleteLesson = (lessonId: number) => {
    Alert.alert('삭제', '이 수업을 정말로 삭제하시겠습니까?', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '삭제',
        onPress: () => removeLesson(lessonId),
        style: 'destructive',
      },
    ]);
  };

  const lessons = (lectureDetail?.lessons || []).slice().reverse(); // 역순 정렬


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackArrowIcon />
        </TouchableOpacity>
        <HeaderText variant="title" style={styles.headerText} weight="bold">
          수업 목록
        </HeaderText>
      </View>
      <FlatList
        data={lessons}
        keyExtractor={item => item.lessonId.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <TouchableOpacity
                onPress={() => handleLessonPress(item.lessonId, item.questions)}
                style={styles.lessonContent}>
                <LessonIcon
                  width={iconSize.md}
                  height={iconSize.md}
                  style={styles.icon}
                />
                <View style={styles.textContainer}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.questionsCount}>
                    문제 개수: {item.questions.length}
                  </Text>
                </View>
              </TouchableOpacity>
              {role === 'TEACHER' && (
                <TouchableOpacity
                  onPress={() => handleDeleteLesson(item.lessonId)}
                  style={styles.deleteButton}>
                  <Text style={styles.deleteButtonText}>삭제하기</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <EmptyLessonIcon
              width={iconSize.xxl * 7}
              height={iconSize.xxl * 7}
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyText}>수업이 없습니다.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#FFF' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  card: {
    marginHorizontal: 40,
    padding: 25,
    backgroundColor: '#DAEAEA',
    marginBottom: 10,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lessonContent: {
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
  itemTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  questionsCount: { fontSize: 14, color: '#666', marginTop: 3 },
  deleteButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#ff9393',
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

export default ClassLessonListScreen;
