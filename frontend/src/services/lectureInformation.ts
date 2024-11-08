import {authApiClient} from '@services/apiClient';

export type ApiResponse<T> = {
  code: string;
  data: T;
  message: string;
};

// 강의 수정
export type LectureScheduleType = {
  day: string;
  period: number;
};

export type UpdateLectureRequest = {
  title: string;
  subject: string;
  introduction: string;
  backgroundColor: string;
  fontColor: string;
  classId: number;
  year: number;
  semester: number;
  schedule: LectureScheduleType[];
};

export type UpdateLectureResponse = {
  lectureId: number;
};

export const updateLectureDetail = async (
  lectureId: number,
  lectureData: UpdateLectureRequest,
): Promise<UpdateLectureResponse> => {
  try {
    console.log('강의 수정 요청 데이터:', lectureData);
    const {data} = await authApiClient.put<ApiResponse<UpdateLectureResponse>>(
      `lecture/${lectureId}`,
      lectureData,
    );
    console.log('강의 수정 응답:', data);
    return data.data;
  } catch (error) {
    console.error('강의 수정 실패:', error);
    throw error;
  }
};

// 강의 삭제
export const deleteLecture = async (lectureId: number): Promise<void> => {
  try {
    await authApiClient.delete<void>(`lecture/${lectureId}`);
    console.log('강의 삭제 성공');
  } catch (error) {
    console.error('강의 삭제 실패:', error);
    throw error;
  }
};

// 공통 타입 정의
export type TeacherType = {
  name: string;
  telephone: string;
  email: string;
  photo: string;
};

export type ScheduleType = {
  day: string;
  period: number;
};

export type NoticeType = {
  noticeId: number;
  title: string;
  content: string;
  createdAt: string;
};

export type ExamType = {
  examId: number;
  title: string;
  startTime: string;
  endTime: string;
  questions: number[];
};

export type HomeworkType = {
  homeworkId: number;
  title: string;
  startTime: string;
  endTime: string;
  questions: number[];
};

export type LessonType = {
  lessonId: number;
  title: string;
  questions: number[];
};

export type LectureDetailType = {
  _id: number;
  title: string;
  subject: string;
  backgroundColor: string;
  fontColor: string;
  year: number;
  semester: number;
  grade: number;
  classNumber: number;
  teacher: TeacherType;
  schedule: ScheduleType[];
  notices: NoticeType[];
  exams: ExamType[];
  homework: HomeworkType[];
  lesson: LessonType[];
};

export const getLectureDetail = async (
  lectureId: number,
): Promise<LectureDetailType> => {
  console.log(`강의 상세 조회 요청: lectureId = ${lectureId}`);

  try {
    const {data} = await authApiClient.get<{
      status: string;
      data: LectureDetailType;
      message: string;
    }>(`/lecture/${lectureId}`);

    console.log('강의 상세 조회 응답:', data);

    return data.data;
  } catch (error) {
    throw error;
  }
};

// 학생용 강의 상세
export type OverviewType = {
  homeworkCnt: number;
  examCnt: number;
  problemBoxCnt: number;
};

export type StudentScoresType = {
  homeworkScore: number;
  testScore: number;
  attitudeScore: number;
};

export type LectureStudentDetailType = {
  overview: OverviewType;
  studentScores: StudentScoresType;
};

export const getStudentLectureDetail = async (
  lectureId: number,
): Promise<LectureStudentDetailType> => {
  console.log(`학생용 강의 상세 조회 요청: lectureId = ${lectureId}`);
  try {
    const {data} = await authApiClient.get<{
      status: string;
      data: LectureStudentDetailType;
      message: string;
    }>(`/lecture/${lectureId}/student`);

    console.log('학생용 강의 상세 조회 응답:', data);

    return data.data;
  } catch (error) {
    throw error;
  }
};

// 선생님용 강의 상세

export type StudentAvgScoresType = {
  homeworkAvgScore: number;
  testAvgScore: number;
  attitudeAvgScore: number;
};

export type StudentType = {
  studentId: number;
  studentImage: string;
  studentName: string;
  studentScores: StudentAvgScoresType;
};

export type ClassAverageScoresType = {
  homeworkAvgScore: number;
  testAvgScore: number;
  attitudeAvgScore: number;
};

export type LectureTeacherDetailType = {
  students: StudentType[];
  classAverageScores: ClassAverageScoresType;
};

export const getTeacherLectureDetail = async (
  lectureId: number,
): Promise<LectureTeacherDetailType> => {
  console.log(`선생님용 강의 상세 조회 요청: lectureId = ${lectureId}`);
  try {
    const {data} = await authApiClient.get<{
      status: string;
      data: LectureTeacherDetailType;
      message: string;
    }>(`/lecture/${lectureId}/teacher`);

    console.log('선생님용 강의 상세 조회 응답:', data.message);

    return data.data;
  } catch (error) {
    throw error;
  }
};

export type ToUpdateLectureResponse = {
  title: string;
  subject: string;
  introduction: string;
  backgroundColor: string;
  fontColor: string;
  classId: number;
  schedule: LectureScheduleType[];
};
// 강의 수정용 조회 함수
export const toupdateLectureDetail = async (
  lectureId: number,
): Promise<ToUpdateLectureResponse> => {
  try {
    console.log('강의 수정 Id : ', lectureId);
    const {data} = await authApiClient.get<{
      status: string;
      data: ToUpdateLectureResponse;
      message: string;
    }>(`/lecture/update/${lectureId}`);

    console.log('강의 수정용 데이터 조회: ', data);
    return data.data;
  } catch (error) {
    console.error('강의 정보 조회 실패:', error);
    throw error;
  }
};

// 강의 리스트 조회용 타입 정의
export type LectureListItemType = {
  lectureId: number;
  title: string;
  subject: string;
  backgroundColor: string;
  fontColor: string;
  classId: number;
  schedule: string[];
  year: number;
  semester: number;
  name: string;
};

export type LectureListResponse = {
  status: string;
  data: LectureListItemType[];
  message: string;
};

// 강의 리스트 조회 함수
export const getLectureList = async (): Promise<LectureListItemType[]> => {
  console.log('강의 리스트 조회 요청');
  try {
    const {data} = await authApiClient.get<LectureListResponse>('/lecture');

    console.log('강의 리스트 조회 응답:', data.data);
    return data.data; // data 필드에 강의 리스트 배열이 포함되어 있음
  } catch (error) {
    console.error('강의 리스트 조회 실패:', error);
    throw error;
  }
};
