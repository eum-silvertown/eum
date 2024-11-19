import { create } from 'zustand';

interface LessoningState {
  memberId: number | null;
  lessonId: number | null;
  questionId: number | null;
  setMemberId: (memberId: number) => void;
  setLessonId: (lessonId: number) => void;
  setQuestionId: (questionId: number) => void;
  setLessoningInfo: (memberId: number, lessonId: number, questionId: number) => void;
}

export const useLessoningStore = create<LessoningState>(set => ({
  memberId: null,
  lessonId: null,
  questionId: null,
  setMemberId: (memberId: number) => set({ memberId }),
  setLessonId: (lessonId: number) => set({ lessonId }),
  setQuestionId: (questionId: number) => set({ questionId }),
  setLessoningInfo: (memberId: number, lessonId: number, questionId: number) =>
    set({ memberId, lessonId, questionId }),
}));
