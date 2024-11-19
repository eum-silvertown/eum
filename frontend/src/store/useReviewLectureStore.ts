import { create } from 'zustand';
import { LessonType } from '@services/lectureInformation';

// 상태 인터페이스 정의
interface ReviewLectureState {
  teacherId: number | null;
  lessons: LessonType[] | null;
  setTeacherId: (teacherId: number) => void;
  setLessons: (lessons: LessonType[]) => void;
  setReviewLectureInfo: (teacherId: number, lessons: LessonType[]) => void;
}

// Zustand 스토어 생성
export const useReviewLectureStore = create<ReviewLectureState>((set) => ({
  teacherId: null,
  lessons: null,
  setTeacherId: (teacherId: number) => set({ teacherId }),
  setLessons: (lessons: LessonType[]) => set({ lessons }),
  setReviewLectureInfo: (teacherId: number, lessons: LessonType[]) =>
    set({ teacherId, lessons }),
}));
