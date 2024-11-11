import {authApiClient} from '@services/apiClient';

export type ApiResponse<T> = {
  code: string;
  data: T;
  message: string;
};

// 수업 수정
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
    console.log('수업 수정 요청 데이터:', lectureData);
    const {data} = await authApiClient.put<ApiResponse<UpdateLectureResponse>>(
      `lecture/${lectureId}`,
      lectureData,
    );
    console.log('수업 수정 응답:', data);
    return data.data;
  } catch (error) {
    console.error('수업 수정 실패:', error);
    throw error;
  }
};

// 수업 삭제
export const deleteLecture = async (lectureId: number): Promise<void> => {
  try {
    await authApiClient.delete<void>(`lecture/${lectureId}`);
    console.log('수업 삭제 성공');
  } catch (error) {
    console.error('수업 삭제 실패:', error);
    throw error;
  }
};

// 교사 정보 타입 정의
export type TeacherType = {
  teacherId: number;
  name: string;
  email: string;
  tel: string;
  image: string | null;
};

// 스케줄 타입 정의
export type ScheduleType = {
  day: string;
  period: number;
};

// 공지사항 타입 정의
export type NoticeType = {
  noticeId: number;
  title: string;
  content: string;
  createdAt: string;
};

// 시험 타입 정의
export type ExamType = {
  examId: number;
  title: string;
  startTime: string;
  endTime: string;
  questions: number[];
};

// 과제 타입 정의
export type HomeworkType = {
  homeworkId: number;
  title: string;
  startTime: string;
  endTime: string;
  questions: number[];
};

// 수업 타입 정의
export type LessonType = {
  lessonId: number;
  title: string;
  questions: number[];
};

// 학생 점수 타입 정의
export type StudentScoreType = {
  homeworkAvgScore: number;
  examAvgScore: number;
  attitudeAvgScore: number;
};

// 학생 개요 타입 정의
export type StudentOverviewType = {
  studentId: number;
  studentImage: string | null;
  studentName: string;
  studentScores: StudentScoreType;
};

// 학급 평균 점수 타입 정의
export type ClassAverageScoresType = {
  homeworkAvgScore: number;
  examAvgScore: number;
  attitudeAvgScore: number;
};

// 교사 개요 타입 정의
export type TeacherOverviewType = {
  id: string;
  teacherId: number;
  lectureId: number;
  students: StudentOverviewType[];
  classAverageScores: ClassAverageScoresType;
};

// 수업 상세 타입 정의
export type LectureDetailType = {
  lectureId: number;
  title: string;
  subject: string;
  introduction: string;
  backgroundColor: string;
  fontColor: string;
  year: number;
  semester: number;
  grade: number;
  classNumber: number;
  teacherModel: TeacherType;
  schedule: ScheduleType[];
  notices: NoticeType[];
  exams: ExamType[];
  homeworks: HomeworkType[];
  lessons: LessonType[];
  studentOverviewModel: StudentOverviewType | null;
  teacherOverviewModel: TeacherOverviewType | null;
};


// 수업 상세 조회 함수
export const getLectureDetail = async (
  lectureId: number,
): Promise<LectureDetailType> => {
  console.log(`수업 상세 조회 요청: lectureId = ${lectureId}`);

  try {
    // 변경된 API 호출을 통해 데이터를 받아옴
    const { data } = await authApiClient.get<{
      status: string;
      data: LectureDetailType;
      message: string;
    }>(`/lecture/${lectureId}`);

    // 응답 데이터를 콘솔에 출력하여 확인
    console.log('수업 상세 조회 응답:', data);

    // 응답 데이터의 data 필드를 반환
    return data.data; // data 필드에 필요한 수업 상세 데이터가 포함되어 있음
  } catch (error) {
    console.error('수업 상세 조회 오류 :', error);

    throw error;
  }
};


// 수업 수정용 조회 함수
export type ToUpdateLectureResponse = {
  title: string;
  subject: string;
  introduction: string;
  backgroundColor: string;
  fontColor: string;
  classId: number;
  schedule: LectureScheduleType[];
};
export const toupdateLectureDetail = async (
  lectureId: number,
): Promise<ToUpdateLectureResponse> => {
  try {
    console.log('수업 수정 Id : ', lectureId);
    const {data} = await authApiClient.get<{
      status: string;
      data: ToUpdateLectureResponse;
      message: string;
    }>(`/lecture/update/${lectureId}`);

    console.log('수업 수정용 데이터 조회: ', data);
    return data.data;
  } catch (error) {
    console.error('수업 정보 조회 실패:', error);
    throw error;
  }
};

// 수업 리스트 조회용 타입 정의
export type LectureListItemType = {
  lectureId: number;
  title: string;
  subject: string;
  backgroundColor: string;
  fontColor: string;
  year: number;
  semester: number;
  grade: number;
  classNumber: number;
  schedule: string[];
  name: string;
};

export type LectureListResponse = {
  status: string;
  data: LectureListItemType[];
  message: string;
};

// 수업 리스트 조회 함수
export const getLectureList = async (): Promise<LectureListItemType[]> => {
  console.log('수업 리스트 조회 요청');
  try {
    const {data} = await authApiClient.get<LectureListResponse>('/lecture');

    console.log('수업 리스트 조회 응답:', data.data);
    return data.data; // data 필드에 수업 리스트 배열이 포함되어 있음
  } catch (error) {
    console.error('수업 리스트 조회 실패:', error);
    throw error;
  }
};