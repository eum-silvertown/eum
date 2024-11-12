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
  problemId: number | null;
  setLessonInfo: (lectureId: number, problemId: number) => void;
}

export const useLessonStore = create<LessonState>(set => ({
  lectureId: null,
  problemId: null,
  setLessonInfo: (lectureId, problemId) => set({lectureId, problemId}),
}));
