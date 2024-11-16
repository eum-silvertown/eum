import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useCurrentScreenStore } from '@store/useCurrentScreenStore';
import { useLessonStore } from '@store/useLessonStore';
import ProblemSection from '@components/common/ProblemSection';
import StudentCanvasSection from '@components/classActivity/StudentCanvasSection';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getFileDetail } from '@services/problemService';
import { ExamProblemSubmission, submitExamProblems } from '@services/examService';
import { useAuthStore } from '@store/useAuthStore';
import { useExamStore } from '@store/useExamStore';

function SolveExamScreen(): React.JSX.Element {
  const memberId = useAuthStore(state => state.userInfo.id);
  const lectureId = useLessonStore(state => state.lectureId);
  const route = useRoute();
  const { examId, questionIds } = route.params as {
    examId: number;
    questionIds: number[];
  };
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [paths, setPaths] = useState<{ [key: number]: string }>({});
  const [remainingTime, setRemainingTime] = useState<number>(0);

  const setCurrentScreen = useCurrentScreenStore(state => state.setCurrentScreen);
  const { exams } = useExamStore();

  useFocusEffect(() => {
    setCurrentScreen('SolveExamScreen');
  });

  useEffect(() => {
    const exam = exams.find(e => e.examId === examId);
    if (exam) {
      const endTime = new Date(exam.endTime).getTime();
      const interval = setInterval(() => {
        const now = Date.now();
        const timeLeft = Math.max(0, endTime - now);
        setRemainingTime(timeLeft);

        if (timeLeft === 0) {
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [examId, exams]);

  const formatTime = (time: number) => {
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((time / (1000 * 60)) % 60);
    const seconds = Math.floor((time / 1000) % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    const minutesLeft = remainingTime / (1000 * 60);
    if (minutesLeft <= 5) { return 'red'; }
    if (minutesLeft <= 10) { return 'orange'; }
    return 'green';
  };

  const {
    data: problems,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['examProblems', questionIds],
    queryFn: async ({ queryKey }) => {
      const [, responseQuestionIds] = queryKey;
      const problemDetails = await Promise.all(
        (responseQuestionIds as number[]).map(questionId =>
          getFileDetail(questionId),
        ),
      );
      return problemDetails;
    },
  });

  const { mutate: submitExamMutation } = useMutation({
    mutationFn: (submissionData: ExamProblemSubmission[]) =>
      submitExamProblems(examId, submissionData),
    onSuccess: () => {
      Alert.alert('제출 완료', '시험이 성공적으로 제출되었습니다.');
      queryClient.invalidateQueries({
        queryKey: ['examSubmissionList'],
      });
      queryClient.invalidateQueries({
        queryKey: ['lectureDetail', lectureId],
      });
      navigation.goBack();
    },
    onError: () => {
      Alert.alert('제출 실패', '시험 제출에 실패했습니다.');
    },
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

  const handleSetAnswer = (questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSetPaths = (questionId: number, pathData: string) => {
    setPaths(prev => ({ ...prev, [questionId]: pathData }));
  };

  const handleSubmit = () => {
    if (!problems) {
      Alert.alert('오류', '문제 정보를 가져오지 못했습니다.');
      return;
    }

    const submissionData = problems.map(problem => {
      const studentAnswer = answers[problem.fileId] || '';
      const isCorrect = studentAnswer.trim() === problem.answer.trim();
      const examSolution = paths[problem.fileId] || '';

      return {
        questionId: problem.fileId,
        studentId: memberId!,
        isCorrect,
        examSolution,
      };
    });

    Alert.alert('제출 확인', '정말로 시험을 제출하시겠습니까?', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '제출',
        onPress: () => submitExamMutation(submissionData),
      },
    ]);
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError || !problems) {
    return <Text>Error loading problems.</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.sectionContainer}>
        <Text style={[styles.timerText, { color: getTimeColor() }]}>
          남은 시간: {formatTime(remainingTime)}
        </Text>
        <ProblemSection problemText={problems[currentPage].content} />
        <StudentCanvasSection
          solveType="EXAM"
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
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SolveExamScreen;
