import {create} from 'zustand';

// ClassDetail 입장 시 업데이트
interface LectureState {
    memberId: number | null;
    teacherId: number | null;
    setLessonInfo: (memberId: number, teacherId: number) => void;
}

export const useLectureStore = create<LectureState>(set => ({
    memberId: null,
    teacherId: null,
    setLessonInfo: (memberId, teacherId) => set({memberId, teacherId}),
}));

// Lesson 입장 시 업데이트
interface LessonState {
  lectureId: number | null;
  questionIds: number[] | null;
  setLessonInfo: (lectureId: number, questionIds: number[]) => void;
}

export const useLessonStore = create<LessonState>(set => ({
  lectureId: null,
  questionIds: null,
  setLessonInfo: (lectureId, questionIds) => set({lectureId, questionIds}),
}));
