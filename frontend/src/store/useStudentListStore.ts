import {create} from 'zustand';

export interface Participant {
  studentId: number;
  studentName: string;
  studentImage: string;
  currentPage: number;
  status: 'in' | 'now' | 'out'; // in: 입장, now: 움직임 감지, out: 나감
}

interface StudentListState {
  participants: Participant[];
  addParticipant: (participant: Participant) => void;
  updateParticipant: (studentId: number, updates: Partial<Participant>) => void;
  removeParticipant: (studentId: number) => void;
}

export const useStudentListStore = create<StudentListState>(set => ({
  participants: [],
  addParticipant: participant =>
    set(state => {
      const exists = state.participants.some(
        p => p.studentId === participant.studentId,
      );
      if (exists) {
        // 이미 존재하는 참가자는 상태를 유지하며 다른 정보를 업데이트
        return {
          participants: state.participants.map(p =>
            p.studentId === participant.studentId
              ? {...p, ...participant, status: p.status} // 기존 상태 유지
              : p,
          ),
        };
      }
      // 새 참가자는 추가
      return {participants: [...state.participants, participant]};
    }),
  updateParticipant: (studentId, updates) =>
    set(state => ({
      participants: state.participants.map(p =>
        p.studentId === studentId ? {...p, ...updates} : p,
      ),
    })),
  removeParticipant: studentId =>
    set(state => ({
      participants: state.participants.filter(p => p.studentId !== studentId),
    })),
}));
