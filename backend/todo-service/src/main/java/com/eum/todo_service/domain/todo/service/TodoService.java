package com.eum.todo_service.domain.todo.service;

import com.eum.todo_service.domain.todo.dto.TodoListResponse;
import com.eum.todo_service.domain.todo.dto.TodoRequest;
import com.eum.todo_service.domain.todo.dto.TodoResponse;
import com.eum.todo_service.domain.todo.dto.TodoStatusUpdateRequest;

public interface TodoService {
    TodoResponse createNewTodo(Long memberId, TodoRequest todoRequest);

    TodoResponse updateTodo(Long memberId, Long todoId, TodoRequest todoRequest);

    void deleteTodo(Long memberId, Long todoId);

    TodoListResponse getTodoList(Long memberId);

    TodoResponse updateTodoState(Long memberId, Long todoId, TodoStatusUpdateRequest todoStatusUpdateRequest);
}
