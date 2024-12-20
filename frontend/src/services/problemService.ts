import {authApiClient} from './apiClient';

// 문제 상세 조회 함수
export type ProblemDetailResponse = {
  code: string;
  data: {
    fileId: number;
    parentId: number;
    title: string;
    content: string;
    answer: string;
  };
  message: string;
};

export type FileDetailErrorResponse = {
  code: string;
  message: string;
};

export const getFileDetail = async (
  fileId: number,
): Promise<ProblemDetailResponse['data']> => {
  try {

    const {data} = await authApiClient.get<ProblemDetailResponse>(
      `/file/${fileId}`,
    );

    return data.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      const errorResponse: FileDetailErrorResponse = error.response.data;
      console.error('파일 상세 조회 실패:', errorResponse.message);
      throw new Error(errorResponse.message);
    } else {
      console.error('알 수 없는 오류:', error);
      throw error;
    }
  }
};
