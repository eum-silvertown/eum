import {QuestionBoxType} from '@store/useQuestionExplorerStore';
import {authApiClient} from './apiClient';
import axios from 'axios';
import RNFS from 'react-native-fs';

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
      title: '문제 보관함',
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

type UploadPdfResponse = {
  url: string;
  key: string;
};

type PdfFile = {
  uri: string;
  type: string | null;
  name: string | null;
};

export const uploadPdf = async (name: string, pdfFile: PdfFile) => {
  try {
    const {data} = await authApiClient.post<UploadPdfResponse>(
      'ocr/generate-presigned-url/upload',
      {
        image_name: name,
      },
    );

    console.log('응답 데이터:', data);

    if (data && data.url) {
      await uploadImageToS3(data.url, pdfFile);
      console.log('uploadImageToS3 done!');
      console.log('key: ', data.key);
      return await convertPdf(data.key);
    } else {
      throw new Error('URL이 응답 데이터에 존재하지 않습니다.');
    }
  } catch (error) {
    console.error('uploadPdf 오류:', error);
    throw error;
  }
};
async function uploadImageToS3(url: string, pdfFile: PdfFile) {
  try {
    // Create FormData
    const formData = new FormData();

    // PDF 파일을 formData에 추가
    formData.append('file', {
      uri: pdfFile.uri,
      type: pdfFile.type || 'application/pdf',
      name: pdfFile.name || 'document.pdf',
    } as any);

    console.log('Starting upload with FormData...');

    // Upload to S3
    const result = await axios.put(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      transformRequest: data => data, // FormData를 그대로 사용
    });

    console.log('Upload successful:', result.status);
    return result;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('S3 Upload Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
}

async function convertPdf(key: string) {
  try {
    const {data} = await authApiClient.post('ocr/convert-pdf', {
      key: key,
    });
    console.log(data.status_response);
    return data.status_response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

type CreateQuestionResponse = {
  answer: string;
  content: string;
  fileId: number;
  parentId: number;
  title: string;
};

export async function createQuestion(
  folderId: number,
  title: string,
  content: string,
  answer: string,
): Promise<CreateQuestionResponse> {
  try {
    const {data} = await authApiClient.post('file', {
      folderId,
      title,
      content,
      answer,
    });
    console.log(data);
    return data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function renameQuestion(
  fileId: number,
  title: string,
): Promise<string> {
  try {
    const {data} = await authApiClient.put('/file', {
      fileId,
      title,
    });
    console.log(data);
    return data.data.title;
  } catch (error) {
    throw error;
  }
}

export async function deleteQuestion(fileId: number) {
  try {
    const {data} = await authApiClient.delete(`file/${fileId}`);
    console.log(data);
  } catch (error) {
    throw error;
  }
}

export async function moveQuestion(fileId: number, toId: number) {
  try {
    const {data} = await authApiClient.post('file/move', {fileId, toId});
    console.log(data);
  } catch (error) {
    throw error;
  }
}
