import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {useQuery} from '@tanstack/react-query';
import {getExamSubmissionDetail} from '@services/examService';
import {getHomeworkSubmissionDetail} from '@services/homeworkService';
import {getFileDetail} from '@services/problemService';
import {useAuthStore} from '@store/useAuthStore';
import {useLessonStore} from '@store/useLessonStore';
import ProblemExSection from '@components/questionBox/ProblemExSection';
import StudentCanvasResolveSection from '@components/classActivity/StudentCanvasResolveSection';
import { useModal } from '@hooks/useModal';
import OverviewModal from '@components/classActivity/OverviewModal';

function ConfirmSolvedScreen(): React.JSX.Element {
  const route = useRoute();
  const { typeId, questionIds, solvedType } = route.params as {
    typeId: number;
    questionIds: number[];
    solvedType: 'EXAM' | 'HOMEWORK' | 'LESSON';
  };

  const lectureId = useLessonStore(state => state.lectureId);
  const memberId = useAuthStore(state => state.userInfo.id);
  const { open } = useModal();

  // EXAM 데이터 가져오기
  const { data: examDetail } = useQuery({
    queryKey: ['examSubmissionDetail', typeId],
    queryFn: () => getExamSubmissionDetail(lectureId!, typeId, memberId),
    enabled: solvedType === 'EXAM',
  });

  const { data: examProblems } = useQuery({
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
    enabled: solvedType === 'EXAM',
  });

  // HOMEWORK 데이터 가져오기
  const { data: homeworkDetail } = useQuery({
    queryKey: ['homeworkSubmissionDetail', typeId],
    queryFn: () => getHomeworkSubmissionDetail(lectureId!, typeId, memberId),
    enabled: solvedType === 'HOMEWORK',
  });

  const { data: homeworkProblems } = useQuery({
    queryKey: ['homeworkProblems', questionIds],
    queryFn: async ({ queryKey }) => {
      const [, responseQuestionIds] = queryKey;
      const problemDetails = await Promise.all(
        (responseQuestionIds as number[]).map(questionId =>
          getFileDetail(questionId),
        ),
      );
      return problemDetails;
    },
    enabled: solvedType === 'HOMEWORK',
  });

  const [currentPage, setCurrentPage] = useState(0);

  const handleNextPage = () => {
    const problems = solvedType === 'EXAM' ? examProblems : homeworkProblems;
    if (currentPage < (problems?.length || 0) - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    const detail = solvedType === 'EXAM' ? examDetail : homeworkDetail;
    if (detail) {
      open(
        <OverviewModal
          score={detail.score}
          correctCount={detail.correctCount}
          totalCount={detail.totalCount}
          onConfirm={() => console.log('Modal confirmed')}
        />,
        { title: '결과' },
      );
    }
  }, [examDetail, homeworkDetail, open, solvedType]);

  const problems = solvedType === 'EXAM' ? examProblems : homeworkProblems;
  const detail = solvedType === 'EXAM' ? examDetail : homeworkDetail;

  if (!detail || !problems) {
    return <Text>Loading...</Text>;
  }

  // 현재 페이지의 문제 ID로 solution을 찾음
  const currentQuestionId = problems[currentPage]?.fileId;
  const currentSolution =
    solvedType === 'EXAM'
      ? examDetail!.problemSubmissions.find(
        submission => submission.questionId === currentQuestionId,
      )?.examSolution // EXAM의 solution
      : homeworkDetail!.problemSubmissions.find(
        submission => submission.questionId === currentQuestionId,
      )?.homeworkSolution; // HOMEWORK의 solution

  return (
    <View style={styles.container}>
      <View style={{marginLeft: '15%', marginTop: '5%'}}>
        <ProblemExSection
          problemText={problems[currentPage].content}
          fontSize={16}
        />
      </View>
      <StudentCanvasResolveSection
        currentPage={currentPage + 1}
        totalPages={problems.length}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
        examSolution={currentSolution || ''} // 현재 페이지의 solution 전달
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
});

export default ConfirmSolvedScreen;
