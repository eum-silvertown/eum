import { authApiClient } from '@services/apiClient';

// 레슨 생성
type CreateLessonRequest = {
  lectureId: number;
  title: string;
  questionIds: number[];
};

type CreateLessonResponse = {
  lessonId: number;
};

export const createLesson = async (
  lessonData: CreateLessonRequest
): Promise<CreateLessonResponse> => {
  try {
    console.log('레슨 생성 요청 데이터:', lessonData);

    const { data } = await authApiClient.post<{
      code: string;
      data: CreateLessonResponse;
      message: string;
    }>('/lesson', lessonData);

    console.log('레슨 생성 응답:', data);
    return data.data;
  } catch (error) {
    console.error('레슨 생성 실패:', error);
    throw error;
  }
};

// 레슨 삭제
type DeleteLessonResponse = {
  code: string;
  data: null;
  message: string;
};

export const deleteLesson = async (lessonId: number): Promise<void> => {
  try {
    console.log(`레슨 삭제 요청: lessonId = ${lessonId}`);

    const { data } = await authApiClient.delete<DeleteLessonResponse>(`/lesson/${lessonId}`);

    console.log('레슨 삭제 응답:', data.message);
  } catch (error) {
    console.error('레슨 삭제 실패:', error);
    throw error;
  }
};

