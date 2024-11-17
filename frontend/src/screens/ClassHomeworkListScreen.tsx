import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { iconSize } from '@theme/iconSize';
import { useNavigation } from '@react-navigation/native';
import ClockIcon from '@assets/icons/clockIcon.svg';
import QuestionsIcon from '@assets/icons/questionsIcon.svg';
import EmptyHomeworkIcon from '@assets/icons/emptyHomeworkIcon.svg';
import BackArrowIcon from '@assets/icons/backArrowIcon.svg';
import { Text as HeaderText } from '@components/common/Text';
import { useQuery } from '@tanstack/react-query';
import {
  getHomeworkSubmissionList,
} from '@services/homeworkService';
import {
  getLectureDetail,
  LectureDetailType,
} from '@services/lectureInformation';
import { useLessonStore } from '@store/useLessonStore';
import { useAuthStore } from '@store/useAuthStore';
import { ScreenType } from '@store/useCurrentScreenStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
type NavigationProps = NativeStackNavigationProp<ScreenType>;

function ClassHomeworkListScreen(): React.JSX.Element {
  const navigation = useNavigation<NavigationProps>();
  const lectureId = useLessonStore(state => state.lectureId);
  const memberId = useAuthStore(state => state.userInfo.id);

  const { data: lectureDetail } = useQuery<LectureDetailType>({
    queryKey: ['lectureDetail', lectureId],
    queryFn: () => getLectureDetail(lectureId!),
  });

  const { data: submitHomeworkList } = useQuery({
    queryKey: ['homeworkSubmissionList', lectureId, memberId],
    queryFn: () => getHomeworkSubmissionList(lectureId!, memberId!),
  });

  const [selectedFilter, setSelectedFilter] = useState<string>('전체'); // 필터

  const handleHomeworkPress = (homework: any) => {
    const endTime = new Date(homework.endTime).getTime();
    const currentTime = Date.now();

    if (homework.isSubmitted) {
      // 제출된 숙제 -> 결과 화면으로 이동
      navigation.navigate('ConfirmSolvedScreen', {
        typeId: homework.homeworkId,
        questionIds: homework.questions,
        solvedType: 'HOMEWORK',
      });
    } else if (currentTime <= endTime) {
      // 기한 내 미제출 -> 숙제 풀이 화면으로 이동
      navigation.navigate('SolveHomeworkScreen', {
        homeworkId: homework.homeworkId,
        questionIds: homework.questions,
      });
    } else {
      // 기한 지난 미제출 -> 알림
      Alert.alert('알림', '기한이 지난 숙제는 제출할 수 없습니다.');
    }
  };

  const submittedHomeworkIds = submitHomeworkList?.map(
    submission => submission.homeworkId,
  );

  const filteredHomework = [...(lectureDetail?.homeworks || [])]
    .map(homework => {
      const isSubmitted = submittedHomeworkIds?.includes(homework.homeworkId);
      const endTime = new Date(homework.endTime);
      const currentTime = Date.now();
      const isPastDeadline = !isSubmitted && endTime.getTime() < currentTime;

      const remainingDays = isPastDeadline
        ? 0
        : Math.ceil((endTime.getTime() - currentTime) / (1000 * 60 * 60 * 24));

      return { ...homework, isSubmitted, isPastDeadline, remainingDays };
    })
    .filter(homework => {
      switch (selectedFilter) {
        case '기한 내 미제출':
          return !homework.isSubmitted && !homework.isPastDeadline;
        case '기한 지난 미제출':
          return !homework.isSubmitted && homework.isPastDeadline;
        case '기한 내 제출':
          return homework.isSubmitted && !homework.isPastDeadline;
        case '기한 지난 제출':
          return homework.isSubmitted && homework.isPastDeadline;
        default: // 전체
          return true;
      }
    })
    .sort((a, b) => {
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
        {/* 필터 Picker */}
        <View style={styles.filterContainer}>
          <Picker
            selectedValue={selectedFilter}
            onValueChange={itemValue => setSelectedFilter(itemValue)}
            style={styles.filterPicker}>
            <Picker.Item label="전체" value="전체" />
            <Picker.Item label="기한 내 미제출" value="기한 내 미제출" />
            <Picker.Item label="기한 지난 미제출" value="기한 지난 미제출" />
            <Picker.Item label="기한 내 제출" value="기한 내 제출" />
            <Picker.Item label="기한 지난 제출" value="기한 지난 제출" />
          </Picker>
        </View>
      </View>
      <FlatList
        data={filteredHomework}
        keyExtractor={(item) => item.homeworkId.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              item.isPastDeadline
                ? styles.pastDeadlineCard
                : item.isSubmitted
                  ? styles.submittedCard
                  : item.remainingDays <= 3
                    ? styles.nearingDeadlineCard
                    : styles.notSubmittedCard,
            ]}
          >
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
                  {item.isPastDeadline && (
                    <Text style={styles.deadlineText}>
                      ※ 기한 내 제출되지 않음
                    </Text>
                  )}
                  {!item.isSubmitted && item.remainingDays > 0 && (
                    <Text style={styles.remainingDaysText}>
                      남은 기간: {item.remainingDays}일
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
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
  notSubmittedCard: {
    backgroundColor: '#EEEEEE', // 제출되지 않은 숙제 배경색
  },
  nearingDeadlineCard: {
    backgroundColor: '#FFF1C1', // 마감이 가까운 숙제 배경색
  },
  submittedCard: {
    backgroundColor: '#D8E1FE', // 제출된 숙제 배경색
  },
  pastDeadlineCard: {
    backgroundColor: '#CCCCCC', // 기한이 지난 숙제 배경색
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
    marginBottom: 5,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  itemText: { fontSize: 14, color: '#666', marginLeft: 5 },
  deadlineText: {
    color: '#FF5555',
    fontWeight: 'bold',
    marginTop: 5,
  },
  remainingDaysText: {
    color: '#FFA500',
    fontWeight: 'bold',
    marginTop: 5,
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

export default ClassHomeworkListScreen;
