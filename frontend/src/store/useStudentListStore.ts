import { create } from 'zustand';

export interface Participant {
  studentId: number;
  studentName: string;
  studentImage: string;
  currentPage: number;
  status: 'default' | 'active' | 'inactive';
}

interface StudentListState {
  participants: Participant[];
  addParticipant: (participant: Participant) => void;
  updateParticipant: (studentId: number, updates: Partial<Participant>) => void;
  removeParticipant: (studentId: number) => void;
}

export const useStudentListStore = create<StudentListState>((set) => ({
  participants: [],
  addParticipant: (participant) =>
    set((state) => ({
      participants: [...state.participants, participant],
    })),
  updateParticipant: (studentId, updates) =>
    set((state) => ({
      participants: state.participants.map((p) =>
        p.studentId === studentId ? { ...p, ...updates } : p
      ),
    })),
  removeParticipant: (studentId) =>
    set((state) => ({
      participants: state.participants.filter(
        (p) => p.studentId !== studentId
      ),
    })),
}));
