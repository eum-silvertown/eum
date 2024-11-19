import {create} from 'zustand';

// ClassDetail 입장 시 업데이트
interface LectureState {
  memberId: number | null;
  teacherId: number | null;
  lectureStudents: number | null;
  setLectureInfo: (memberId: number, teacherId: number) => void;
  setStudentsCnt: (lectureStudents: number) => void;
}

export const useLectureStore = create<LectureState>(set => ({
  memberId: null,
  teacherId: null,
  lectureStudents: null,
  setLectureInfo: (memberId, teacherId) => set({memberId, teacherId}),
  setStudentsCnt: (lectureStudents) => set({lectureStudents}),
}));

// Lesson 입장 시 업데이트 / Detail에서 필요 시 추가 업데이트
interface LessonState {
  lectureId: number | null;
  lessonId: number | null;
  questionIds: number[] | null;
  isTeaching: boolean | null;
  setLectureId: (lectureId: number) => void;
  setLessonInfo: (lessonId: number, questionIds: number[]) => void;
  setIsTeaching: (isTeaching: boolean) => void;
  setLessonId: (lessonId:number) => void;
}

export const useLessonStore = create<LessonState>(set => ({
  lectureId: null,
  questionIds: null,
  lessonId: null,
  isTeaching: null,
  setLectureId: lectureId => set({lectureId}),
  setLessonInfo: (lessonId, questionIds) => set({lessonId, questionIds}),
  setIsTeaching: isTeaching => set({isTeaching}),
  setLessonId: lessonId => set({lessonId}),
}));
