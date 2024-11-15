import {authApiClient} from '@services/apiClient';

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

    const {data} = await authApiClient.post<{
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

// 시험 문제 제출 요청 타입 정의
export type ExamProblemSubmission = {
  questionId: number;
  studentId: number;
  isCorrect: boolean;
  examSolution: string;
};

export type ExamSubmissionResponse = {
  code: string;
  data: number; // 서브미션 ID
  message: string;
};

export const submitExamProblems = async (
  examId: number,
  submissionData: ExamProblemSubmission[],
): Promise<number> => {
  try {
    console.log('시험 문제 제출 요청:', submissionData);

    const {data} = await authApiClient.post<{
      code: string;
      data: number;
      message: string;
    }>(`/exam/${examId}/submission`, submissionData);

    console.log('시험 문제 제출 성공 응답:', data);
    return data.data; // 서브미션 ID 반환
  } catch (error) {
    console.error('시험 문제 제출 실패:', error);
    throw error;
  }
};

// 학생의 시험 제출 내역 조회
export type ProblemSubmission = {
  examProblemSubmissionId: number;
  questionId: number;
  isCorrect: boolean;
  examSolution: string;
};

export type ExamSubmission = {
  examSubmissionId: number;
  examId: number;
  score: number;
  correctCount: number;
  totalCount: number;
  problemSubmissions: ProblemSubmission[];
};

export type ExamSubmissionListResponse = ExamSubmission[];

export const getExamSubmissionList = async (
  lectureId: number,
  studentId: number,
): Promise<ExamSubmissionListResponse> => {
  try {
    const {data} = await authApiClient.get<{
      code: string;
      data: ExamSubmissionListResponse;
      message: string;
    }>(`/exam/${lectureId}/student/${studentId}/submissions`);

    console.log('학생의 시험 제출 내역 조회 응답:', data);
    return data.data;
  } catch (error) {
    console.error('학생의 시험 제출 내역 조회 실패:', error);
    throw error;
  }
};
