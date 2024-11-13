import {authApiClient} from '@services/apiClient';

// 공지사항 생성
export type LectureNoticeType = {
  lectureId: number;
  title: string;
  content: string;
};

export const createNotice = async (
  noticeData: LectureNoticeType,
): Promise<void> => {
  try {
    console.log('정보 전달 완료 noticeData:', noticeData);
    await authApiClient.post<void>('/notice', noticeData);
  } catch (error) {
    console.log('error', error);

    throw error;
  }
};

// 공지사항 삭제
export const deleteNotice = async (noticeId: number): Promise<void> => {
  try {
    console.log('공지사항 삭제 요청:', noticeId);
    await authApiClient.delete<void>(`notice/${noticeId}`);
  } catch (error) {
    throw error;
  }
};
