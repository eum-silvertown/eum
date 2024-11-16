import { create } from 'zustand';

export type ExamType = {
  examId: number;
  title: string;
  startTime: string;
  endTime: string;
  questions: number[];
};

type ExamState = {
  exams: ExamType[]; // 시험 데이터 배열
  setExams: (exams: ExamType[]) => void; // 시험 데이터 설정
  clearExams: () => void; // 시험 데이터 초기화
};

export const useExamStore = create<ExamState>(set => ({
  exams: [],

  setExams: (exams: ExamType[]) => {
    set({ exams });
  },

  clearExams: () => {
    set({ exams: [] });
  },
}));
