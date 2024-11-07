import {QuestionBoxType} from '@store/useQuestionExplorerStore';
import {authApiClient} from './apiClient';

// API 응답 타입 정의
type ApiResponse<T> = {
  code: string;
  data: T;
  message: string;
};

type FileType = {
  fileId: number;
  parentId: number;
  title: string;
};

type FolderType = {
  folderId: number;
  parentId: number;
  title: string;
  childrenCount: number;
};

type GetFolderResponse = {
  folderId: number;
  subFolders: FolderType[];
  subFiles: FileType[];
};

export const getRootFolder = async (): Promise<QuestionBoxType> => {
  try {
    const {data} = await authApiClient.get<ApiResponse<GetFolderResponse>>(
      'folder/root',
    );
    console.log(data.data.subFolders);
    let rootFolder: QuestionBoxType = {
      id: data.data.folderId,
      type: 'folder',
      parentId: null,
      title: '홈',
      children: [],
      childrenCount: 0,
    };
    data.data.subFolders.forEach(folder => {
      const formedFolder: QuestionBoxType = {
        id: folder.folderId,
        type: 'folder',
        parentId: folder.parentId,
        title: folder.title,
        children: [],
        childrenCount: folder.childrenCount,
      };
      rootFolder.children?.push(formedFolder);
    });
    data.data.subFiles.forEach(file => {
      const formedFile: QuestionBoxType = {
        id: file.fileId,
        type: 'file',
        parentId: file.parentId,
        title: file.title,
        children: [],
        childrenCount: 0,
      };
      rootFolder.children?.push(formedFile);
    });
    return rootFolder;
  } catch (error) {
    throw error;
  }
};

type CreateFolderResponse = {
  folderId: number; // Long -> number in TypeScript
  title: string;
  childrenCount: number; // Long -> number in TypeScript
};

export const createFolder = async (
  title: string,
  parentId: number,
): Promise<QuestionBoxType> => {
  try {
    const {data} = await authApiClient.post<ApiResponse<CreateFolderResponse>>(
      'folder',
      {
        title: title,
        parentId: parentId,
      },
    );

    return {
      id: data.data.folderId,
      type: 'folder',
      parentId,
      title,
      children: [],
      childrenCount: 0,
    }; // 실제 폴더 데이터만 반환
  } catch (error) {
    throw error;
  }
};

export const getFolder = async (
  folderId: number,
): Promise<QuestionBoxType[]> => {
  try {
    const {data} = await authApiClient.get<ApiResponse<GetFolderResponse>>(
      `folder/${folderId}`,
    );
    let children: QuestionBoxType[] = [];
    data.data.subFolders.forEach(folder => {
      const formedFolder: QuestionBoxType = {
        id: folder.folderId,
        type: 'folder',
        parentId: folder.parentId,
        title: folder.title,
        children: [],
        childrenCount: folder.childrenCount,
      };
      children.push(formedFolder);
    });
    data.data.subFiles.forEach(file => {
      const formedFile: QuestionBoxType = {
        id: file.fileId,
        type: 'file',
        parentId: file.parentId,
        title: file.title,
        children: [],
        childrenCount: 0,
      };
      children.push(formedFile);
    });
    return children;
  } catch (error) {
    throw error;
  }
};

export const deleteFolder = async (folderId: number) => {
  try {
    const {data} = await authApiClient.delete<ApiResponse<null>>(
      `folder/${folderId}`,
    );
    console.log(data);
  } catch (error) {
    throw error;
  }
};

export const renameFolder = async (
  folderId: number,
  title: string,
): Promise<string> => {
  try {
    const {data} = await authApiClient.patch<ApiResponse<CreateFolderResponse>>(
      'folder',
      {
        folderId,
        title,
      },
    );
    return data.data.title;
  } catch (error) {
    throw error;
  }
};

export const moveFolder = async (folderId: number, toId: number) => {
  try {
    const {data} = await authApiClient.post<ApiResponse<null>>('folder/move', {
      folderId: folderId,
      toId: toId,
    });
    console.log(data);
  } catch (error) {
    throw error;
  }
};
