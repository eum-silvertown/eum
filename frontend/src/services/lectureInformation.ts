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
    const {data} = await authApiClient.put<ApiResponse<UpdateLectureResponse>>(
      `lecture/${lectureId}`,
      lectureData,
    );
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
  image: string;
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
  studentImage: string;
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
  lectureStatus: boolean;
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
  try {
    const {data} = await authApiClient.get<{
      status: string;
      data: LectureDetailType;
      message: string;
    }>(`/lecture/${lectureId}`);

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
  teacher: TeacherType;
};

export type LectureListResponse = {
  status: string;
  data: LectureListItemType[];
  message: string;
};

// 수업 리스트
export const getLectureList = async (): Promise<LectureListItemType[]> => {
  console.log('수업 리스트 조회 요청');
  try {
    const {data} = await authApiClient.get<LectureListResponse>('/lecture');

    return data.data;
  } catch (error) {
    console.error('수업 리스트 조회 실패:', error);
    throw error;
  }
};

// 요일별 수업 리스트 조회용 타입 정의
export type LectureListDayItemType = {
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
  teacher: {
    teacherId: number;
    name: string;
    email: string;
    tel: string;
    image: string | null;
  };
  scheduleDays: string[];
  lecturePeriod: number[];
};

// 수업 목록 요일별 조회
export const getLectureListDay = async (
  day: string,
  year: number,
  semester: number,
): Promise<LectureListDayItemType[]> => {
  console.log('요일별 수업 리스트 조회 요청');
  try {
    const {data} = await authApiClient.get('/lecture/day', {
      params: {
        day,
        year,
        semester,
      },
    });
    console.log('요일별 수업 리스트 조회 응답:', data.data);
    // lecture_period를 lecturePeriod로 매핑하여 반환
    return data.data.map((item: any) => ({
      ...item,
      lecturePeriod: item.lecture_period,
    }));
  } catch (error) {
    console.error('요일별 수업 리스트 조회 실패:', error);
    throw error;
  }
};

// 수업 생성
export type CreateLectureRequest = {
  title: string;
  subject: string;
  introduction: string;
  backgroundColor: string;
  fontColor: string;
  school: string;
  grade: number;
  classNumber: number;
  year: number;
  semester: number;
  schedule: LectureScheduleType[];
};

export type CreateLectureResponse = {
  lectureId: number;
};

export const postCreateLecture = async (
  createData: CreateLectureRequest,
): Promise<CreateLectureResponse> => {
  try {
    const {data} = await authApiClient.post<ApiResponse<CreateLectureResponse>>(
      '/lecture',
      createData,
    );

    return data.data;
  } catch (error) {
    console.error('수업 생성 실패:', error);
    throw error;
  }
};

// 학생 태도 점수 조정 함수
export const adjustStudentAttitudeScore = async (
  lectureId: number,
  studentId: number,
): Promise<void> => {
  try {
    const {data} = await authApiClient.post<ApiResponse<null>>(
      `/lecture/${lectureId}/attitude/${studentId}`,
    );

    console.log('학생 점수 조정 성공:', data.message);
  } catch (error) {
    console.error('학생 점수 조정 실패:', error);
    throw error; // 에러 발생 시 호출 측으로 전달
  }
};
