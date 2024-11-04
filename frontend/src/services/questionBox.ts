import axios from 'axios';

// API 응답 타입 정의
type ApiResponse<T> = {
  code: string;
  data: T;
  message: string;
};

type CreateFolderResponse = {
  folderId: number; // Long -> number in TypeScript
  title: string;
  childrenCount: number; // Long -> number in TypeScript
};

export const createFolder = async (
  title: string,
  parentId: number,
): Promise<CreateFolderResponse> => {
  axios.defaults.headers['X-MEMBER-ID'] = 1;
  try {
    const {data} = await axios.post<ApiResponse<CreateFolderResponse>>(
      'folder',
      {
        title: title,
        parentId: parentId,
      },
    );
    return data.data; // 실제 폴더 데이터만 반환
  } catch (error) {
    throw error;
  }
};
