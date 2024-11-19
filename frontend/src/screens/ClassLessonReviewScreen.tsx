import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useReviewLectureStore} from '@store/useReviewLectureStore';
import {useQuery} from '@tanstack/react-query';
import {getFileDetail} from '@services/problemService';
import ProblemExSection from '@components/questionBox/ProblemExSection';
import StudentCanvasReviewSection from '@components/classActivity/StudentCanvasReviewSection';
import {useAuthStore} from '@store/useAuthStore';
import {
  getStudentDrawingData,
  getTeacherDrawingData,
} from '@services/lessonService';
import {useRoute} from '@react-navigation/native';

function ClassLessonReviewScreen(): React.JSX.Element {
  const route = useRoute();
  const teacherId = useReviewLectureStore(state => state.teacherId);
  const {lessonId, questionIds} = route.params as {
    lessonId: number;
    questionIds: number[];
  };
  const studentId = useAuthStore(state => state.userInfo.id);
  const role = useAuthStore(state => state.userInfo.role);

  const [currentPage, setCurrentPage] = useState(0);

  const currentQuestionId = questionIds?.[currentPage];

  // 문제 데이터 가져오기
  const {data: lessonProblems} = useQuery({
    queryKey: ['lessonProblems', questionIds],
    queryFn: async ({queryKey}) => {
      const [, responseQuestionIds] = queryKey;
      const problemDetails = await Promise.all(
        (responseQuestionIds as number[]).map(questionId =>
          getFileDetail(questionId),
        ),
      );
      return problemDetails;
    },
    enabled: !!questionIds, // questionIds가 존재할 때만 요청
  });

  // 선생님 그림 데이터 가져오기
  const {data: teacherDrawingData} = useQuery({
    queryKey: ['teacherDrawing', teacherId, lessonId, currentQuestionId],
    queryFn: async () => {
      if (teacherId && lessonId && currentQuestionId) {
        return getTeacherDrawingData(teacherId, lessonId, currentQuestionId);
      }
      return null;
    },
    enabled: !!(teacherId && lessonId && currentQuestionId), // 데이터가 존재할 때만 요청
  });

  // 학생 그림 데이터 가져오기
  const {data: studentDrawingData} = useQuery({
    queryKey: ['studentDrawing', studentId, lessonId, currentQuestionId],
    queryFn: async () => {
      if (studentId && lessonId && currentQuestionId) {
        return getStudentDrawingData(studentId, lessonId, currentQuestionId);
      }
      return null;
    },
    enabled: !!(
      studentId &&
      lessonId &&
      currentQuestionId &&
      role === 'STUDENT'
    ), // 데이터가 존재할 때만 요청
  });

  const problems = lessonProblems || [];
  const teacherDrawing = teacherDrawingData?.drawingData || null;
  const studentDrawing = studentDrawingData?.drawingData || null;

  const handleNextPage = () => {
    if (currentPage < problems.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{marginLeft: '15%', marginTop: '5%'}}>
        <ProblemExSection
          problemText={problems[currentPage]?.content || ''}
          fontSize={16}
        />
      </View>
      <StudentCanvasReviewSection
        teacherDrawing={teacherDrawing}
        studentDrawing={studentDrawing}
        currentPage={currentPage + 1}
        totalPages={problems.length}
        onNextPage={handleNextPage}
        onPrevPage={handlePrevPage}
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

export default ClassLessonReviewScreen;
