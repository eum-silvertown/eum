import {authApiClient} from '@services/apiClient';

// 숙제 생성
export type CreateHomeworkRequest = {
  lectureId: number;
  title: string;
  startTime: string;
  endTime: string;
  questionIds: number[];
};

export type CreateHomeworkResponse = {
  homeworkId: number;
};

export const createHomework = async (
  homeworkData: CreateHomeworkRequest,
): Promise<CreateHomeworkResponse> => {
  try {
    console.log('숙제 생성 요청 데이터:', homeworkData);

    const {data} = await authApiClient.post<{
      code: string;
      data: CreateHomeworkResponse;
      message: string;
    }>('/homework', homeworkData);

    console.log('숙제 생성 응답:', data);

    return data.data;
  } catch (error) {
    console.error('숙제 생성 실패:', error);
    throw error;
  }
};

// 숙제 삭제
export const deleteHomework = async (homeworkId: number): Promise<void> => {
  try {
    console.log('숙제 삭제 요청 ID:', homeworkId);

    await authApiClient.delete<void>(`/homework/${homeworkId}`);

    console.log('숙제 삭제 성공');
  } catch (error) {
    console.error('숙제 삭제 실패:', error);
    throw error;
  }
};

// 숙제 문제 제출
type HomeworkSubmissionRequest = {
  problemId: number;
  studentId: number;
  isCorrect: boolean;
}[];

export const submitHomeworkProblems = async (
  homeworkId: number,
  submissionData: HomeworkSubmissionRequest,
): Promise<void> => {
  try {
    console.log('숙제 문제 제출 요청 데이터:', submissionData);

    await authApiClient.post<void>(
      `/homework/${homeworkId}/submission`,
      submissionData,
    );

    console.log('숙제 문제 제출 성공');
  } catch (error) {
    console.error('숙제 문제 제출 실패:', error);
    throw error;
  }
};

// 숙제 상세 조회
type HomeworkDetailResponse = {
  questionIds: number[];
  questionAnswers: string[];
  studentAnswers: string[];
  drawingPaths: string;
};

export const getHomeworkDetail = async (
  lectureId: number,
  homeworkId: number,
): Promise<HomeworkDetailResponse> => {
  try {
    console.log(
      `숙제 상세 조회 요청: lectureId = ${lectureId}, homeworkId = ${homeworkId}`,
    );

    const {data} = await authApiClient.get<HomeworkDetailResponse>(
      `/lecture/${lectureId}/homework/${homeworkId}`,
    );

    console.log('숙제 상세 조회 응답:', data);
    return data;
  } catch (error) {
    console.error('숙제 상세 조회 실패:', error);
    throw error;
  }
};

// 숙제 제출 리스트 조회
export type ProblemSubmission = {
  homeworkProblemSubmissionId: number;
  questionId: number;
  isCorrect: boolean;
  homeworkSolution: string;
};

export type HomeworkSubmission = {
  homeworkSubmissionId: number;
  homeworkId: number;
  score: number;
  correctCount: number;
  totalCount: number;
  problemSubmissions: ProblemSubmission[];
};

export type HomeworkSubmissionListResponse = HomeworkSubmission[];

export const getHomeworkSubmissionList = async (
  lectureId: number,
  studentId: number,
): Promise<HomeworkSubmissionListResponse> => {
  try {
    console.log(
      `숙제 제출 리스트 조회 요청: lectureId = ${lectureId}, studentId = ${studentId}`,
    );

    const {data} = await authApiClient.post<{
      code: string;
      data: HomeworkSubmissionListResponse;
      message: string;
    }>(`/api/homework/${lectureId}/student/${studentId}/submissions`);

    console.log('숙제 제출 리스트 조회 응답:', data);
    return data.data;
  } catch (error) {
    console.error('숙제 제출 리스트 조회 실패:', error);
    throw error;
  }
};
