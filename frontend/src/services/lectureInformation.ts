import axios from 'axios';

axios.defaults.headers['X-MEMBER-ROLE'] = 'TEACHER';

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
    const {data} = await axios.put<ApiResponse<UpdateLectureResponse>>(
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
    console.log(`강의 삭제 요청: lectureId = ${lectureId}`);

    return;

    // eslint-disable-next-line no-unreachable
    await axios.delete<void>(`lecture/${lectureId}`);
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
    const dummydata = {
      _id: lectureId,
      title: '고급 수학',
      subject: '수학',
      backgroundColor: '#3b5998',
      fontColor: '#FFFFFF',
      year: 2024,
      semester: 2,
      grade: 3,
      classNumber: 1,
      teacher: {
        name: '홍길동',
        telephone: '01098765432',
        email: 'teacher_math@example.com',
        photo: 'src/assets/images/teacher.png',
      },
      schedule: [
        {day: '월요일', period: 2},
        {day: '수요일', period: 4},
        {day: '금요일', period: 1},
      ],
      notices: [
        {
          noticeId: 1,
          title: '기말고사 준비 안내',
          content: '기말고사 날짜는 12월 1일입니다. 범위는 전체 단원입니다.',
          createdAt: '2024-11-10T08:00:00Z',
        },
        {
          noticeId: 2,
          title: '보충 수업 안내',
          content: '보충 수업이 금요일 오후 3시에 진행됩니다.',
          createdAt: '2024-11-03T08:00:00Z',
        },
      ],
      exams: [
        {
          examId: 1,
          title: '중간고사',
          startTime: '2024-10-20T08:30:00Z',
          endTime: '2024-10-20T10:30:00Z',
          questions: [5, 12, 20],
        },
        {
          examId: 2,
          title: '기말고사',
          startTime: '2024-12-01T09:00:00Z',
          endTime: '2024-12-01T11:00:00Z',
          questions: [8, 15, 23],
        },
        {
          examId: 3,
          title: '복습 시험',
          startTime: '2024-12-10T13:00:00Z',
          endTime: '2024-12-10T14:30:00Z',
          questions: [16, 18, 21],
        },
        {
          examId: 4,
          title: '연습 문제 풀이',
          startTime: '2024-11-15T10:00:00Z',
          endTime: '2024-11-15T11:00:00Z',
          questions: [9, 14, 27],
        },
        {
          examId: 5,
          title: '모의고사',
          startTime: '2024-11-20T09:30:00Z',
          endTime: '2024-11-20T12:00:00Z',
          questions: [11, 22, 33],
        },
        {
          examId: 6,
          title: '실전 대비 시험',
          startTime: '2024-12-05T14:00:00Z',
          endTime: '2024-12-05T16:00:00Z',
          questions: [4, 19, 26],
        },
      ],
      homework: [
        {
          homeworkId: 1,
          title: '수학 문제 풀이 숙제 1',
          startTime: '2024-10-25T08:00:00Z',
          endTime: '2024-10-26T08:00:00Z',
          questions: [2, 3, 7],
        },
        {
          homeworkId: 2,
          title: '수학 문제 풀이 숙제 2',
          startTime: '2024-10-27T08:00:00Z',
          endTime: '2024-10-28T08:00:00Z',
          questions: [5, 6, 8],
        },
        {
          homeworkId: 3,
          title: '수학 문제 풀이 숙제 3',
          startTime: '2024-10-29T08:00:00Z',
          endTime: '2024-10-30T08:00:00Z',
          questions: [1, 4, 9],
        },
        {
          homeworkId: 4,
          title: '수학 문제 풀이 숙제 4',
          startTime: '2024-10-31T08:00:00Z',
          endTime: '2024-11-07T08:00:00Z',
          questions: [2, 10, 11],
        },
        {
          homeworkId: 5,
          title: '수학 문제 풀이 숙제 5',
          startTime: '2024-11-02T08:00:00Z',
          endTime: '2024-11-08T08:00:00Z',
          questions: [12, 13, 14],
        },
        {
          homeworkId: 6,
          title: '수학 문제 풀이 숙제 6',
          startTime: '2024-11-04T08:00:00Z',
          endTime: '2024-11-05T08:00:00Z',
          questions: [15, 16, 17],
        },
      ],
      lesson: [
        {
          lessonId: 1,
          title: '미적분 파트 1',
          questions: [101, 102, 103],
        },
        {
          lessonId: 2,
          title: '미적분 파트 2',
          questions: [104, 105, 106],
        },
        {
          lessonId: 3,
          title: '기하와 벡터 파트 1',
          questions: [107, 108, 109],
        },
        {
          lessonId: 4,
          title: '기하와 벡터 파트 2',
          questions: [110, 111, 112],
        },
        {
          lessonId: 5,
          title: '확률과 통계 파트 1',
          questions: [113, 114, 115],
        },
        {
          lessonId: 6,
          title: '확률과 통계 파트 2',
          questions: [116, 117, 118],
        },
      ],
    };

    return dummydata;

    // eslint-disable-next-line no-unreachable
    const {data} = await axios.get<{
      status: string;
      data: LectureDetailType;
      message: string;
    }>(`lecture/${lectureId}`);

    console.log('강의 상세 조회 응답:', data);

    return data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios Error Message:', error.message);
      if (error.response) {
        console.error('Error Response Data:', error.response.data);
        console.error('Error Response Status:', error.response.status);
        console.error('Error Response Headers:', error.response.headers);
      }
    } else {
      console.error('Unknown Error:', error);
    }
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
    const dummydata = {
      overview: {
        homeworkCnt: 10,
        examCnt: 2,
        problemBoxCnt: 50,
      },
      studentScores: {
        homeworkScore: 64.0,
        testScore: 35.0,
        attitudeScore: 148.0,
      },
    };
    return dummydata;

    // eslint-disable-next-line no-unreachable
    const {data} = await axios.get<{
      status: string;
      data: LectureStudentDetailType;
      message: string;
    }>(`lecture/${lectureId}/student`);

    console.log('학생용 강의 상세 조회 응답:', data);

    return data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios Error Message:', error.message);
      if (error.response) {
        console.error('Error Response Data:', error.response.data);
        console.error('Error Response Status:', error.response.status);
        console.error('Error Response Headers:', error.response.headers);
      }
    } else {
      console.error('Unknown Error:', error);
    }
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
    const dummyData = {
      students: [
        {
          studentId: 1,
          studentImage: 'path/to/student1.jpg',
          studentName: '이영희',
          studentScores: {
            homeworkAvgScore: 78.0,
            testAvgScore: 82.0,
            attitudeAvgScore: 88.0,
          },
        },
        {
          studentId: 2,
          studentImage: 'path/to/student2.jpg',
          studentName: '박민수',
          studentScores: {
            homeworkAvgScore: 91.0,
            testAvgScore: 89.0,
            attitudeAvgScore: 84.0,
          },
        },
        {
          studentId: 3,
          studentImage: 'path/to/student3.jpg',
          studentName: '김수진',
          studentScores: {
            homeworkAvgScore: 85.0,
            testAvgScore: 90.0,
            attitudeAvgScore: 92.0,
          },
        },
        {
          studentId: 4,
          studentImage: 'path/to/student4.jpg',
          studentName: '최지훈',
          studentScores: {
            homeworkAvgScore: 72.0,
            testAvgScore: 77.0,
            attitudeAvgScore: 80.0,
          },
        },
        {
          studentId: 5,
          studentImage: 'path/to/student5.jpg',
          studentName: '정다연',
          studentScores: {
            homeworkAvgScore: 95.0,
            testAvgScore: 93.0,
            attitudeAvgScore: 97.0,
          },
        },
        {
          studentId: 6,
          studentImage: 'path/to/student6.jpg',
          studentName: '오준영',
          studentScores: {
            homeworkAvgScore: 84.0,
            testAvgScore: 88.0,
            attitudeAvgScore: 90.0,
          },
        },
        {
          studentId: 7,
          studentImage: 'path/to/student7.jpg',
          studentName: '유미나',
          studentScores: {
            homeworkAvgScore: 90.0,
            testAvgScore: 85.0,
            attitudeAvgScore: 88.0,
          },
        },
        {
          studentId: 8,
          studentImage: 'path/to/student8.jpg',
          studentName: '한지성',
          studentScores: {
            homeworkAvgScore: 76.0,
            testAvgScore: 80.0,
            attitudeAvgScore: 85.0,
          },
        },
      ],
      classAverageScores: {
        homeworkAvgScore: 83.0,
        testAvgScore: 86.0,
        attitudeAvgScore: 89.0,
      },
    };
    return dummyData;
    // eslint-disable-next-line no-unreachable
    const {data} = await axios.get<{
      status: string;
      data: LectureTeacherDetailType;
      message: string;
    }>(`lecture/${lectureId}/teacher`);

    console.log('선생님용 강의 상세 조회 응답:', data.message);

    return data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios Error Message:', error.message);
      if (error.response) {
        console.error('Error Response Data:', error.response.data);
        console.error('Error Response Status:', error.response.status);
        console.error('Error Response Headers:', error.response.headers);
      }
    } else {
      console.error('Unknown Error:', error);
    }
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
    const dummydata = {
      'title': '수정예제 제목',
      'subject': '수정과목',
      'introduction': '수정할 소개 칸 입니다.',
      'backgroundColor': '#000000',
      'fontColor': '#ffffff',
      'classId': 5,
      'schedule': [
        {
          'day': '수요일',
          'period': 1,
        },
        {
          'day': '금요일',
          'period': 2,
        },
      ],
    };
    return dummydata;

    // eslint-disable-next-line no-unreachable
    const { data } = await axios.get<{ status: string; data: ToUpdateLectureResponse; message: string;}>(
      `lecture/update/${lectureId}`);

    console.log('강의 수정용 데이터 조회: ', data);
    return data.data;
  } catch (error) {
    console.error('강의 정보 조회 실패:', error);
    throw error;
  }
};
