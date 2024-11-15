import React, {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {useCurrentScreenStore} from '@store/useCurrentScreenStore';
import {getResponsiveSize} from '@utils/responsive';
import {useLessonStore} from '@store/useLessonStore';
import ProblemSection from '@components/common/ProblemSection';
import StudentCanvasSection from '@components/classActivity/StudentCanvasSection';
import {useQuery} from '@tanstack/react-query';
import {getFileDetail} from '@services/problemService';

function SolveHomeworkScreen(): React.JSX.Element {
  const lessonId = useLessonStore(state => state.lessonId);
  const route = useRoute();
  const {homeworkId, questionIds} = route.params as {
    homeworkId: number;
    questionIds: number[];
  };

  const [currentPage, setCurrentPage] = useState(0);

  // 문제 상세 정보 가져오기 - 모든 questionId에 대해 병렬로 호출
  const {
    data: problems,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['homeworkProblems', questionIds],
    queryFn: async ({queryKey}) => {
      const [, responseQuestionIds] = queryKey; // queryKey에서 responseQuestionIds 추출
      const problemDetails = await Promise.all(
        (responseQuestionIds as number[]).map(questionId =>
          getFileDetail(questionId),
        ),
      );
      return problemDetails;
    },
    enabled: !!questionIds.length, // questionIds가 있을 때만 쿼리 실행
  });

  const handleNextPage = () => {
    if (currentPage < (problems?.length || 0) - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const setCurrentScreen = useCurrentScreenStore(
    state => state.setCurrentScreen,
  );

  useFocusEffect(() => {
    setCurrentScreen('SolveHomeworkScreen');
  });

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError || !problems) {
    return <Text>Error loading problems.</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.sectionContainer}>
        <ProblemSection problemText={problems![currentPage].content} />
        <StudentCanvasSection
          lessonId={lessonId!}
          currentPage={currentPage + 1}
          totalPages={problems!.length}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  sectionContainer: {
    flex: 1,
    padding: 16,
    position: 'relative',
  },
  problemSection: {
    flex: 1,
    zIndex: 1,
  },
  canvasSection: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },
  connectionChip: {
    position: 'absolute',
    bottom: getResponsiveSize(160),
    right: getResponsiveSize(32),
    paddingVertical: getResponsiveSize(12),
    paddingHorizontal: getResponsiveSize(18),
    borderRadius: getResponsiveSize(32),
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectionChipText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sendMessageButton: {
    position: 'absolute',
    bottom: getResponsiveSize(32),
    right: getResponsiveSize(32),
  },
  receivedMessageContainer: {
    position: 'absolute',
    bottom: getResponsiveSize(250),
    right: getResponsiveSize(32),
    backgroundColor: '#f0f0f0',
    padding: getResponsiveSize(16),
    borderRadius: getResponsiveSize(12),
    borderColor: '#d0d0d0',
    borderWidth: 1,
    maxWidth: getResponsiveSize(400),
  },
  receivedMessageText: {
    fontSize: getResponsiveSize(20),
    color: '#333',
  },
});

export default SolveHomeworkScreen;
