// useLectureStore.ts
import { create } from 'zustand';

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
}

interface LectureStore {
  lectures: LectureType[];
  setLectures: (data: LectureType[]) => void;
}

export const useLectureStore = create<LectureStore>(set => ({
  lectures: [],
  setLectures: (data: LectureType[]) => set({ lectures: data }),
}));
