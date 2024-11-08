// useLectureStore.ts
import {create} from 'zustand';

export interface LectureType {
  lectureId?: number;
  title: string;
  subject: string;
  backgroundColor: string;
  fontColor: string;
  grade: string;
  classNumber: string;
  teacherName?: string;
  lecturePeriod?: number;
  year?: number;
  semester?: number;
}

interface LectureStore {
  lectures: LectureType[];
  setLectures: (data: LectureType[]) => void;
}

const dummyData: LectureType[] = [
  {
    lectureId: 112,
    title: '2024-1 영어 텍스쳐 없죠?',
    subject: '영어',
    backgroundColor: '#F3FF84',
    fontColor: '#000000',
    grade: '3',
    classNumber: '2',
    teacherName: '롱기누스',
    lecturePeriod: 3,
    year: 2024,
    semester: 1,
  },
  {
    lectureId: 113,
    title: '2024-1 나야, 국어기름',
    subject: '국어',
    backgroundColor: '#6A80C8',
    fontColor: '#000000',
    grade: '3',
    classNumber: '2',
    teacherName: '강록최',
    lecturePeriod: 2,
    year: 2024,
    semester: 1,
  },
  {
    lectureId: 114,
    title: '2024-2 이게뭐여, 수학이여?',
    subject: '수학',
    backgroundColor: '#FF7171',
    fontColor: '#FFFFFF',
    grade: '3',
    classNumber: '2',
    teacherName: '백종원',
    lecturePeriod: 7,
    year: 2024,
    semester: 2,
  },
  {
    lectureId: 115,
    title: '영어 텍스쳐 없죠?',
    subject: '영어',
    backgroundColor: '#F3FF84',
    fontColor: '#000000',
    grade: '3',
    classNumber: '2',
    teacherName: '롱기누스',
    lecturePeriod: 4,
    year: 2024,
    semester: 2,
  },
  {
    lectureId: 116,
    title: '나야, 국어기름',
    subject: '국어',
    backgroundColor: '#6A80C8',
    fontColor: '#000000',
    grade: '3',
    classNumber: '2',
    teacherName: '강록최',
    lecturePeriod: 6,
    year: 2023,
    semester: 2,
  },
  {
    lectureId: 117,
    title: '이게뭐여, 수학이여?',
    subject: '수학',
    backgroundColor: '#FF7171',
    fontColor: '#FFFFFF',
    grade: '3',
    classNumber: '2',
    teacherName: '백종원',
    lecturePeriod: 1,
    year: 2023,
    semester: 1,
  },
  {
    lectureId: 119,
    title: '나야, 국어기름',
    subject: '국어',
    backgroundColor: '#6A80C8',
    fontColor: '#000000',
    grade: '3',
    classNumber: '2',
    teacherName: '강록최',
    lecturePeriod: 5,
    year: 2023,
    semester: 1,
  },
];

export const useLectureStore = create<LectureStore>(set => ({
  lectures: dummyData, // 초기 상태에 더미 데이터를 설정
  setLectures: (data: LectureType[]) => set({lectures: data}),
}));
