import {create} from 'zustand';

interface LessonState {
  memberId: number | null;
  teacherId: number | null;
  setLessonInfo: (memberId: number, teacherId: number) => void;
}

export const useLessonStore = create<LessonState>(set => ({
  memberId: null,
  teacherId: null,
  setLessonInfo: (memberId, teacherId) => set({memberId, teacherId}),
}));
