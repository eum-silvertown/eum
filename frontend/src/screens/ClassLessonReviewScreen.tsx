import { View, StyleSheet } from 'react-native';
import { useLessonStore } from '@store/useLessonStore';
import { useReviewLectureStore } from '@store/useReviewLectureStore';
import { useQuery } from '@tanstack/react-query';
import { getFileDetail } from '@services/problemService';
import ProblemSection from '@components/common/ProblemSection';
import StudentCanvasReviewSection from '@components/classActivity/StudentCanvasReviewSection';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@store/useAuthStore';
import { getStudentDrawingData, getTeacherDrawingData } from '@services/lessonService';
import { useRoute } from '@react-navigation/native';

function ClassLessonReviewScreen(): React.JSX.Element {
  const route = useRoute();
  const teacherId = useReviewLectureStore((state) => state.teacherId);
  const { lessonId } = route.params as {
    lessonId: number;
  };
  const questionIds = useLessonStore((state) => state.questionIds);
  const studentId = useAuthStore((state) => state.userInfo.id);

  const { data: lessonProblems } = useQuery({
    queryKey: ['lessonProblems', questionIds],
    queryFn: async ({ queryKey }) => {
      const [, responseQuestionIds] = queryKey;
      const problemDetails = await Promise.all(
        (responseQuestionIds as number[]).map((questionId) =>
          getFileDetail(questionId)
        )
      );
      return problemDetails;
    },
  });

  const [currentPage, setCurrentPage] = useState(0);
  const [teacherDrawing, setTeacherDrawing] = useState<string | null>(null);
  const [studentDrawing, setStudentDrawing] = useState<string | null>(null);

  const currentQuestionId = questionIds![currentPage];
  const problems = lessonProblems || [];

  // 선생님과 학생 그림 데이터 조회
  useEffect(() => {
    if (teacherId && lessonId && currentQuestionId) {
      // 선생님 그림 데이터 요청
      getTeacherDrawingData(teacherId, lessonId, currentQuestionId)
        .then((data) => setTeacherDrawing(data.drawingData))
        .catch((error) => {
          console.error('Failed to fetch teacher drawing:', error);
          setTeacherDrawing(null);
        });

      // 학생 그림 데이터 요청
      getStudentDrawingData(studentId, lessonId, currentQuestionId)
        .then((data) => setStudentDrawing(data.drawingData))
        .catch((error) => {
          console.error('Failed to fetch student drawing:', error);
          setStudentDrawing(null);
        });
    }
  }, [teacherId, lessonId, currentQuestionId, studentId]);

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
      <ProblemSection problemText={problems[currentPage]?.content || ''} />
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
