import {authApiClient} from '@services/apiClient';

// 레슨 생성
export type CreateLessonRequest = {
  lectureId: number;
  title: string;
  questionIds: number[];
};

export type CreateLessonResponse = {
  data: number;
};

export const createLesson = async (
  lessonData: CreateLessonRequest,
): Promise<CreateLessonResponse> => {
  try {
    const {data} = await authApiClient.post<CreateLessonResponse>(
      '/lesson',
      lessonData,
    );

    return data;
  } catch (error) {
    throw error;
  }
};

// 레슨 삭제
export type DeleteLessonResponse = {
  code: string;
  data: null;
  message: string;
};

export const deleteLesson = async (lessonId: number): Promise<void> => {
  try {
    const {data} = await authApiClient.delete<DeleteLessonResponse>(
      `/lesson/${lessonId}`,
    );

    console.log('레슨 삭제 응답:', data.message);
  } catch (error) {
    console.error('레슨 삭제 실패:', error);
    throw error;
  }
};

// 수업 상태 변경
export type SwitchLessonStatusResponse = {
  status: string;
  data: null;
  message: string;
};

export const switchLessonStatus = async (
  lectureId: number,
): Promise<SwitchLessonStatusResponse> => {
  try {
    const {data} = await authApiClient.post<SwitchLessonStatusResponse>(
      `/lecture/${lectureId}/switch`,
    );

    return data;
  } catch (error) {
    console.error('수업 상태 변경 실패:', error);
    throw error;
  }
};

// 선생님 그림 데이터 조회
export type GetTeacherDrawingDataResponse = {
  code: string;
  data: {
    drawingData: string;
    width: number;
    height: number;
    lessonId: number;
    memberId: number;
    questionId: number;
  };
  message: string;
};

export const getTeacherDrawingData = async (
  teacherId: number,
  lessonId: number,
  questionId?: number, // Query parameter는 선택적(optional) 처리
): Promise<GetTeacherDrawingDataResponse['data']> => {
  try {
    console.log(
      `선생님 그림 데이터 조회 요청: teacherId = ${teacherId}, lessonId = ${lessonId}, questionId = ${questionId}`,
    );

    const {data} = await authApiClient.get<GetTeacherDrawingDataResponse>(
      `/drawing/teacher/${teacherId}/lesson/${lessonId}`,
      {
        params: {questionId}, // Query parameter 추가
      },
    );

    return data.data; // 응답 데이터의 `data` 필드 반환
  } catch (error) {
    console.error('선생님 그림 데이터 조회 실패:', error);
    throw error;
  }
};

// 학생 그림 데이터 조회
export type GetStudentDrawingDataResponse = {
  code: string;
  data: {
    drawingData: string;
    width: number;
    height: number;
    lessonId: number;
    memberId: number;
    questionId: number;
  };
  message: string;
};

export const getStudentDrawingData = async (
  studentId: number,
  lessonId: number,
  questionId?: number, // Query parameter는 선택적(optional) 처리
): Promise<GetStudentDrawingDataResponse['data']> => {
  try {
    console.log(
      `학생 그림 데이터 조회 요청: studentId = ${studentId}, lessonId = ${lessonId}, questionId = ${questionId}`,
    );

    const {data} = await authApiClient.get<GetStudentDrawingDataResponse>(
      `/drawing/student/${studentId}/lesson/${lessonId}`,
      {
        params: {questionId}, // Query parameter 추가
      },
    );

    return data.data; // 응답 데이터의 `data` 필드 반환
  } catch (error) {
    console.error('학생 그림 데이터 조회 실패:', error);
    throw error;
  }
};
