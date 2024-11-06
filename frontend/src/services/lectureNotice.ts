import axios from 'axios';

axios.defaults.headers['X-MEMBER-ROLE'] = 'TEACHER';

// 공지사항 생성
export type LectureNoticeType = {
    lectureId: number,
    title: string,
    content: string
};

export const createNotice = async (
noticeData: LectureNoticeType
): Promise<void> => {
  try {
    await axios.post<void>('/api/notice', noticeData);
  } catch (error) {
    throw error;
  }
};

// 공지사항 삭제
export const deleteNotice = async (noticeId: number): Promise<void> => {
    try {
      await axios.delete<void>(`/api/notice/${noticeId}`);
    } catch (error) {
      throw error;
    }
};

// 공지사항 수정
export type UpdateNoticeType = {
    lectureId: number;
    title: string;
    content: string;
  };

export const updateNotice = async (
    noticeId: number,
    noticeData: UpdateNoticeType
  ): Promise<void> => {
    try {
      await axios.put<void>(`/api/notice/${noticeId}`, noticeData);
    } catch (error) {
      throw error;
    }
};
