import React, { useState, useEffect } from 'react';
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
import ClockIcon from '@assets/icons/clockIcon.svg';
import QuestionsIcon from '@assets/icons/questionsIcon.svg';
import EmptyHomeworkIcon from '@assets/icons/emptyHomeworkIcon.svg';
import BackArrowIcon from '@assets/icons/backArrowIcon.svg';
import { Text as HeaderText } from '@components/common/Text';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteHomework } from '@services/homeworkService';
import {
  getLectureDetail,
  LectureDetailType,
} from '@services/lectureInformation';
import { useLessonStore } from '@store/useLessonStore';
import { useAuthStore } from '@store/useAuthStore';
import { ScreenType } from '@store/useCurrentScreenStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type NavigationProps = NativeStackNavigationProp<ScreenType>;

function ClassHomeworkListTeacherScreen(): React.JSX.Element {
  const navigation = useNavigation<NavigationProps>();
  const queryClient = useQueryClient();
  const lectureId = useLessonStore((state) => state.lectureId);
  const role = useAuthStore((state) => state.userInfo.role);

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

  const { mutate: removeHomework } = useMutation({
    mutationFn: (homeworkId: number) => deleteHomework(homeworkId),
    onSuccess: () => {
      Alert.alert('알림', '숙제가 삭제되었습니다.');
      queryClient.invalidateQueries({
        queryKey: ['lectureDetail', lectureId],
      });
    },
    onError: (error) => {
      console.error('숙제 삭제 실패:', error);
    },
  });

  const handleHomeworkPress = (homeworkId: number) => {
    navigation.navigate('ClassHomeworkStudentSubmitListScreen', { homeworkId });
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

  const homeworks = (lectureDetail?.homeworks || [])
    .map((homework) => {
      const startTime = new Date(homework.startTime);
      const endTime = new Date(homework.endTime);
      const now = currentTime.getTime();

      const isBeforeStart = now < startTime.getTime();
      const isOngoing = now >= startTime.getTime() && now <= endTime.getTime();
      const isAfterEnd = now > endTime.getTime();

      const remainingTime = Math.max(0, endTime.getTime() - now);
      const remainingDays = Math.floor(remainingTime / (1000 * 60 * 60 * 24)); // 남은 일수
      const remainingHours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24); // 남은 시간
      const remainingMinutes = Math.floor((remainingTime / (1000 * 60)) % 60); // 남은 분
      const remainingSeconds = Math.floor((remainingTime / 1000) % 60); // 남은 초

      return {
        ...homework,
        isBeforeStart,
        isOngoing,
        isAfterEnd,
        remainingDays,
        remainingHours,
        remainingMinutes,
        remainingSeconds,
      };
    })
    .sort((a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime());


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
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#FFDDFF' }]} />
          <Text style={styles.legendText}>시작 전</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#FFFFDD' }]} />
          <Text style={styles.legendText}>진행 중</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#DDFFDD' }]} />
          <Text style={styles.legendText}>종료</Text>
        </View>
      </View>
      <FlatList
        data={homeworks}
        keyExtractor={(item) => item.homeworkId.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              item.isBeforeStart
                ? styles.beforeStartCard
                : item.isOngoing
                  ? styles.ongoingCard
                  : styles.afterEndCard,
            ]}
          >
            <View style={styles.cardContent}>
              <TouchableOpacity
                onPress={() => handleHomeworkPress(item.homeworkId)}
                style={styles.homeworkContent}
              >
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
                  {item.isOngoing && (
                    <Text style={styles.remainingTimeText}>
                      남은 시간:
                      {item.remainingDays > 0 && `${item.remainingDays}일 `}
                      {item.remainingHours}시간 {item.remainingMinutes}분
                      {item.remainingDays === 0 && ` ${item.remainingSeconds}초`}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
              {role === 'TEACHER' && (
                <TouchableOpacity
                  onPress={() => handleDeleteHomework(item.homeworkId)}
                  style={styles.deleteButton}
                >
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
            <Text style={styles.emptyText}>숙제가 없습니다.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#FFF' },
  header: {
    marginTop: 25,
    marginBottom: 10,
    marginLeft: 25,
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
    backgroundColor: '#FFFFDD', // 진행 중 배경색
  },
  afterEndCard: {
    backgroundColor: '#DDFFDD', // 종료 후 배경색
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
    marginBottom: 5,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  itemText: { fontSize: 14, color: '#666', marginLeft: 5 },
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
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
    marginRight: 60,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 5,
  },
  legendText: {
    fontSize: 14,
    color: '#666',
  },

});

export default ClassHomeworkListTeacherScreen;
