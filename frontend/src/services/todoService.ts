import {authApiClient} from './apiClient';

interface TodoDataType {
  title: string;
  content: string;
  prioirty: number;
}

// Todo 목록 조회
export const getTodos = async (): Promise<any> => {
  try {
    const response = await authApiClient.get('/todo-service');

    console.log('Todo 목록 조회 성공,', response.data);
    return response.data;
  } catch (error) {
    console.error('Todo 목록 조회 실패', error);
    throw error;
  }
};

// Todo 생성
export const createTodo = async (  
  todoItem: TodoDataType,
): Promise<any> => {
  try {
    const response = await authApiClient.post(
      `/todo-service`,
      todoItem,
    );

    console.log('Todo 생성 성공', response.data);
    return response.data;
  } catch (error) {
    console.error('Todo 생성 실패', error);
    throw error;
  }
};

// Todo 수정
export const updateTodo = async (
  todoId: number,
  todoItem: TodoDataType,
): Promise<any> => {
  try {
    const response = await authApiClient.put(
      `/todo-service/${todoId}`,
      todoItem,
    );

    console.log('Todo 수정 성공', response.data);
    return response.data;
  } catch (error) {
    console.error('Todo 수정 실패', error);
    throw error;
  }
};

// Todo 삭제
export const deleteTodo = async (todoId: number): Promise<any> => {
  try {
    const response = await authApiClient.delete(`/todo-service/${todoId}`);

    console.log('Todo 수정 성공', response.data);
    return response.data;
  } catch (error) {
    console.error('Todo 수정 실패', error);
    throw error;
  }
};

// Todo 상태 토글
export const toggleTodo = async (
  todoId: number,
  status: boolean,
): Promise<any> => {
  try {
    const response = await authApiClient.patch(`/todo-service/${todoId}`, {status});
  } catch (error) {
    console.log('Todo 상태 토글 실패', error);
    throw error;
  }
};
