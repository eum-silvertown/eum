import { authApiClient } from '@services/apiClient';

// 시험 생성
export type CreateExamRequest = {
  lectureId: number;
  title: string;
  startTime: string;
  endTime: string;
  questionIds: number[];
};

export type CreateExamResponse = {
  examId: number;
};

export const createExam = async (
  examData: CreateExamRequest,
): Promise<CreateExamResponse> => {
  try {
    console.log('시험 생성 요청 데이터:', examData);

    const { data } = await authApiClient.post<{
      code: string;
      data: CreateExamResponse;
      message: string;
    }>('/exam', examData);

    console.log('시험 생성 응답:', data);
    return data.data;
  } catch (error) {
    console.error('시험 생성 실패:', error);
    throw error;
  }
};

// 시험 수정
export type UpdateExamRequest = {
  lectureId: number;
  title: string;
  startTime: string;
  endTime: string;
  questionIds: number[];
};

export type UpdateExamResponse = {
  examId: number;
};

export const updateExam = async (
  examId: number,
  examData: UpdateExamRequest,
): Promise<UpdateExamResponse> => {
  try {
    console.log(`시험 수정 요청 데이터 (examId: ${examId}):`, examData);

    const { data } = await authApiClient.put<{
      code: string;
      data: UpdateExamResponse;
      message: string;
    }>(`/exam/${examId}`, examData);

    console.log('시험 수정 응답:', data);
    return data.data;
  } catch (error) {
    console.error('시험 수정 실패:', error);
    throw error;
  }
};

// 시험 삭제
export const deleteExam = async (examId: number): Promise<void> => {
  try {
    console.log(`시험 삭제 요청 (examId: ${examId})`);

    await authApiClient.delete<void>(`/exam/${examId}`);

    console.log('시험 삭제 성공');
  } catch (error) {
    console.error('시험 삭제 실패:', error);
    throw error;
  }
};

// 시험 문제 제출
type ExamSubmissionRequest = {
  problemId: number;
  studentId: number;
  isCorrect: boolean;
}[];

export const submitExamProblems = async (
  examId: number,
  submissionData: ExamSubmissionRequest
): Promise<void> => {
  try {
    console.log('시험 문제 제출 요청 데이터:', submissionData);

    await authApiClient.post<void>(
      `/exam/${examId}/submission`,
      submissionData
    );

    console.log('시험 문제 제출 성공');
  } catch (error) {
    console.error('시험 문제 제출 실패:', error);
    throw error;
  }
};
