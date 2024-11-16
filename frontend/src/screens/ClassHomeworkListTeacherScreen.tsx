import React from 'react';
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

  const handleHomeworkPress = (homework: any) => {
    console.log(homework);

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
        data={lectureDetail?.homeworks || []}
        keyExtractor={(item) => item.homeworkId.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <TouchableOpacity
                onPress={() => handleHomeworkPress(item)}
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
    marginHorizontal: 40,
    padding: 25,
    marginBottom: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: '#EEEEEE',
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

export default ClassHomeworkListTeacherScreen;
