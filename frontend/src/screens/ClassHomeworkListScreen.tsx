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
import {iconSize} from '@theme/iconSize';
import {useNavigation} from '@react-navigation/native';
import ClockIcon from '@assets/icons/clockIcon.svg';
import QuestionsIcon from '@assets/icons/questionsIcon.svg';
import EmptyHomeworkIcon from '@assets/icons/emptyHomeworkIcon.svg';
import BackArrowIcon from '@assets/icons/backArrowIcon.svg';
import {Text as HeaderText} from '@components/common/Text';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
  deleteHomework,
  getHomeworkSubmissionList,
} from '@services/homeworkService';
import {
  getLectureDetail,
  LectureDetailType,
} from '@services/lectureInformation';
import {useLessonStore} from '@store/useLessonStore';
import {useAuthStore} from '@store/useAuthStore';
import {ScreenType} from '@store/useCurrentScreenStore';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
type NavigationProps = NativeStackNavigationProp<ScreenType>;

function ClassHomeworkListScreen(): React.JSX.Element {
  const navigation = useNavigation<NavigationProps>();
  const queryClient = useQueryClient();
  const lectureId = useLessonStore(state => state.lectureId);
  const role = useAuthStore(state => state.userInfo.role);
  const memberId = useAuthStore(state => state.userInfo.id);

  const {data: lectureDetail} = useQuery<LectureDetailType>({
    queryKey: ['lectureDetail', lectureId],
    queryFn: () => getLectureDetail(lectureId!),
  });

  const {data: submitHomeworkList} = useQuery({
    queryKey: ['homeworkSubmissionList', lectureId, memberId],
    queryFn: () => getHomeworkSubmissionList(lectureId!, memberId!),
  });

  const {mutate: removeHomework} = useMutation({
    mutationFn: (homeworkId: number) => deleteHomework(homeworkId),
    onSuccess: () => {
      Alert.alert('알림', '숙제가 삭제되었습니다.');
      queryClient.invalidateQueries({
        queryKey: ['lectureDetail', lectureId],
      });
    },
    onError: error => {
      console.error('숙제 삭제 실패:', error);
    },
  });

  const handleHomeworkPress = (homeworkId: number, questionIds: number[]) => {
    console.log(homeworkId, questionIds);
  };

  const handleDeleteHomework = (homeworkId: number) => {
    Alert.alert('숙제 삭제', '이 숙제를 정말로 삭제하시겠습니까?', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '삭제',
        onPress: () => removeHomework(homeworkId),
        style: 'destructive',
      },
    ]);
  };

  // 제출된 숙제 리스트에서 homeworkId만 추출
  const submittedHomeworkIds = submitHomeworkList?.map(
    submission => submission.homeworkId,
  );

  // 전체 숙제 리스트를 제출 여부, 마감일에 따라 정렬하고 마감된 숙제에 대한 표시를 추가
  const sortedHomework = [...(lectureDetail?.homeworks || [])]
    .map(homework => {
      const isSubmitted = submittedHomeworkIds?.includes(homework.homeworkId);
      const isPastDeadline =
        !isSubmitted && new Date(homework.endTime).getTime() < Date.now();
      return {...homework, isSubmitted, isPastDeadline};
    })
    .sort((a, b) => {
      // 제출 여부와 마감일로 정렬
      if (a.isSubmitted === b.isSubmitted) {
        if (a.isPastDeadline === b.isPastDeadline) {
          return new Date(a.endTime).getTime() - new Date(b.endTime).getTime();
        }
        return a.isPastDeadline ? 1 : -1;
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
          숙제 목록
        </HeaderText>
      </View>
      <FlatList
        data={sortedHomework}
        keyExtractor={item => item.homeworkId.toString()}
        renderItem={({item}) => (
          <View
            style={[
              styles.card,
              item.isPastDeadline
                ? styles.pastDeadlineCard // 제출되지 않았고 마감된 숙제의 배경색
                : item.isSubmitted
                ? styles.submittedCard // 제출된 숙제의 배경색
                : styles.notSubmittedCard, // 제출되지 않은 숙제의 배경색
            ]}>
            <View style={styles.cardContent}>
              <TouchableOpacity
                onPress={() =>
                  handleHomeworkPress(item.homeworkId, item.questions)
                }
                style={styles.homeworkContent}>
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
                  <View style={styles.iconRow}>
                    <QuestionsIcon width={iconSize.sm} height={iconSize.sm} />
                    <Text style={styles.itemText}>
                      문제 개수: {item.questions.length}
                    </Text>
                  </View>
                  {item.isPastDeadline && (
                    <Text style={styles.deadlineText}>
                      ※ 기한 내 제출되지 않음
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
              {role === 'TEACHER' && (
                <TouchableOpacity
                  onPress={() => handleDeleteHomework(item.homeworkId)}
                  style={styles.deleteButton}>
                  <Text style={styles.deleteButtonText}>삭제하기</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <EmptyHomeworkIcon
              width={iconSize.xxl * 7}
              height={iconSize.xxl * 7}
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyText}>현재 등록된 숙제가 없습니다.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: spacing.lg, backgroundColor: '#FFF'},
  card: {
    marginHorizontal: spacing.xxl,
    padding: spacing.xl,
    marginBottom: spacing.md,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  notSubmittedCard: {
    backgroundColor: '#F9E1E1', // 제출되지 않은 숙제 배경색
  },
  submittedCard: {
    backgroundColor: '#D8E1FE', // 제출된 숙제 배경색
  },
  pastDeadlineCard: {
    backgroundColor: '#FFE4E1', // 기한이 지난 숙제 배경색
    borderColor: '#FF5555',
    borderWidth: 1,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  homeworkContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: spacing.sm,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  itemText: {fontSize: 14, color: '#666', marginLeft: spacing.sm},
  deadlineText: {
    color: '#FF5555',
    fontWeight: 'bold',
    marginTop: spacing.xs,
  },
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
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
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

export default ClassHomeworkListScreen;
