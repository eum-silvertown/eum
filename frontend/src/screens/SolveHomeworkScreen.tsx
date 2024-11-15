import React, { useState } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useCurrentScreenStore } from '@store/useCurrentScreenStore';
import { useLessonStore } from '@store/useLessonStore';
import ProblemSection from '@components/common/ProblemSection';
import StudentCanvasSection from '@components/classActivity/StudentCanvasSection';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getFileDetail } from '@services/problemService';
import { HomeworkSubmissionRequest, submitHomework } from '@services/homeworkService';
import { useAuthStore } from '@store/useAuthStore';

function SolveHomeworkScreen(): React.JSX.Element {
  const memberId = useAuthStore(state => state.userInfo.id);
  const lectureId = useLessonStore(state => state.lectureId);
  const setCurrentScreen = useCurrentScreenStore(state => state.setCurrentScreen);
  const queryClient = useQueryClient();
  const route = useRoute();
  const { homeworkId, questionIds } = route.params as {
    homeworkId: number;
    questionIds: number[];
  };

  useFocusEffect(() => {
    setCurrentScreen('SolveHomeworkScreen');
  });
  const navigate = useNavigation();
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [paths, setPaths] = useState<{ [key: number]: string }>({});

  const {
    data: problems,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['homeworkProblems', questionIds],
    queryFn: async ({ queryKey }) => {
      const [, responseQuestionIds] = queryKey;
      const problemDetails = await Promise.all(
        (responseQuestionIds as number[]).map(questionId =>
          getFileDetail(questionId),
        ),
      );
      console.log('문제 상세 데이터:', problemDetails); // 문제 데이터 확인
      return problemDetails;
    },
    enabled: !!questionIds.length,
  });

  // 숙제 제출 Mutation
  const { mutate: submitHomeworkMutation } = useMutation({
    mutationFn: (submissionData: HomeworkSubmissionRequest) =>
      submitHomework(homeworkId, submissionData),
    onSuccess: () => {
      Alert.alert('제출 완료', '숙제가 성공적으로 제출되었습니다.');
      queryClient.invalidateQueries({
        queryKey: ['homeworkSubmissionList'],
      });
      queryClient.invalidateQueries({
        queryKey: ['lectureDetail', lectureId],
      });
      navigate.goBack();
    },
    onError: () => {
      Alert.alert('제출 실패', '숙제를 제출하는데 실패했습니다.');
    },
  });

  // 페이지 이동 핸들러
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

  // 정답 및 필기 데이터 저장
  const handleSetAnswer = (questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSetPaths = (questionId: number, pathData: string) => {
    setPaths(prev => ({ ...prev, [questionId]: pathData }));
  };

  // 숙제 제출 로직
  const handleSubmit = () => {
    if (!problems) {
      Alert.alert('오류', '문제 정보를 가져오지 못했습니다.');
      return;
    }

    const submissionData = problems.map(problem => {
      const studentAnswer = answers[problem.fileId] || '';
      const isCorrect = studentAnswer.trim() === problem.answer.trim();
      const homeworkSolution = paths[problem.fileId] || '';

      return {
        questionId: problem.fileId,
        studentId: memberId!,
        isCorrect,
        homeworkSolution,
      };
    });

    // 제출 확인 Alert
    Alert.alert('제출 확인', '정말로 숙제를 제출하시겠습니까?', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '제출',
        onPress: () => submitHomeworkMutation(submissionData),
      },
    ]);
  };

  // 로딩 상태 처리
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError || !problems) {
    return <Text>Error loading problems.</Text>;
  }

  // 화면 렌더링
  return (
    <View style={styles.container}>
      <View style={styles.sectionContainer}>
        {/* 문제 섹션 */}
        <ProblemSection problemText={problems[currentPage].content} />

        {/* 학생 캔버스 섹션 */}
        <StudentCanvasSection
          solveType="HOMEWORK"
          currentPage={currentPage + 1}
          totalPages={problems.length}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
          savePaths={(pathData: string) =>
            handleSetPaths(problems[currentPage].fileId, pathData)
          }
          saveAnswer={(answer: string) =>
            handleSetAnswer(problems[currentPage].fileId, answer)
          }
          onSubmit={handleSubmit}
        />
      </View>
    </View>
  );
}

// 스타일 정의
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
});

export default SolveHomeworkScreen;
