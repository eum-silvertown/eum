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
export type HomeworkSubmissionRequest = {
  questionId: number;
  studentId: number;
  isCorrect: boolean;
  homeworkSolution: string;
}[];

export type HomeworkSubmissionResponse = {
  code: string;
  data: number;
  message: string;
};

export const submitHomework = async (
  homeworkId: number,
  submissionData: HomeworkSubmissionRequest,
): Promise<HomeworkSubmissionResponse['data']> => {
  try {
    console.log('숙제 문제 제출 요청 데이터:', submissionData);

    const {data} = await authApiClient.post<HomeworkSubmissionResponse>(
      `/homework/${homeworkId}/submission`,
      submissionData,
    );

    console.log('숙제 문제 제출 응답:', data);

    return data.data; // 서브미션 ID 반환
  } catch (error) {
    console.error('숙제 문제 제출 실패:', error);
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

    const {data} = await authApiClient.get<{
      code: string;
      data: HomeworkSubmissionListResponse;
      message: string;
    }>(`/homework/${lectureId}/student/${studentId}/submissions`);

    console.log('숙제 제출 리스트 조회 응답:', data);
    return data.data;
  } catch (error) {
    console.error('숙제 제출 리스트 조회 실패:', error);
    throw error;
  }
};

type HomeworkDetailType = {
  correctCount: number;
  endTime: string;
  subject: string;
  title: string;
  totalCount: number;
}

export type AllAboutHomeworkType = {
  averageScore: number;
  completedHomeworkCount: number;
  homeworkDetails: HomeworkDetailType[];
  totalHomeworkCount: number;
}

export async function getAllAboutHomework(userId: number): Promise<AllAboutHomeworkType> {
  try {
    const {data} = await authApiClient.get(`homework/${userId}`);
    return data.data;
  } catch (error) {
    console.error('Failed to get All About Homework: ', error);
    throw error;
  }
}

// 학생의 특정 숙제 제출 내역 조회
export type HomeworkProblemSubmission = {
  homeworkProblemSubmissionId: number;
  questionId: number;
  isCorrect: boolean;
  homeworkSolution: string; // 학생이 문제를 푼 답안
};

export type HomeworkSubmissionDetail = {
  homeworkSubmissionId: number;
  homeworkId: number;
  score: number;
  correctCount: number;
  totalCount: number;
  problemSubmissions: HomeworkProblemSubmission[];
};

export const getHomeworkSubmissionDetail = async (
  lectureId: number,
  homeworkId: number,
  studentId: number
): Promise<HomeworkSubmissionDetail> => {
  try {
    console.log(
      `학생의 특정 숙제 제출 내역 조회 요청 (lectureId: ${lectureId}, homeworkId: ${homeworkId}, studentId: ${studentId})`
    );

    const { data } = await authApiClient.get<{
      code: string;
      data: HomeworkSubmissionDetail;
      message: string;
    }>(`/homework/${lectureId}/${homeworkId}/submissions/${studentId}`);

    console.log('학생의 특정 숙제 제출 내역 조회 성공 응답:', data);
    return data.data;
  } catch (error) {
    console.error('학생의 특정 숙제 제출 내역 조회 실패:', error);
    throw error;
  }
};

// 특정 숙제 모든 학생들 제출 내역 조회
export type HomeworkProblemStudentSubmission = {
  homeworkProblemSubmissionId: number;
  questionId: number;
  isCorrect: boolean;
  homeworkSolution: string;
};

export type HomeworkStudentSubmission = {
  homeworkSubmissionId: number;
  homeworkId: number;
  studentId: number;
  studentName: string;
  studentImage: string;
  score: number;
  correctCount: number;
  totalCount: number;
  isCompleted: boolean;
  problemSubmissions: HomeworkProblemStudentSubmission[];
};

export type GetHomeworkSubmissionsResponse = {
  code: string;
  data: HomeworkStudentSubmission[];
  message: string;
};

export const getHomeworkSubmissions = async (
  lectureId: number,
  homeworkId: number
): Promise<HomeworkStudentSubmission[]> => {
  try {
    console.log(
      `숙제 제출 내역 조회 요청: lectureId = ${lectureId}, homeworkId = ${homeworkId}`
    );

    const { data } = await authApiClient.get<GetHomeworkSubmissionsResponse>(
      `/homework/${lectureId}/${homeworkId}/submissions`
    );

    console.log('숙제 제출 내역 조회 성공 응답:', data);
    return data.data;
  } catch (error) {
    console.error('숙제 제출 내역 조회 실패:', error);
    throw error;
  }
};
