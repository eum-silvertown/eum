package com.eum.todo_service.domain.todo.service;

import com.eum.todo_service.domain.todo.dto.TodoRequest;
import com.eum.todo_service.domain.todo.dto.TodoResponse;

public interface TodoService {
    TodoResponse createNewTodo(Long memberId, TodoRequest todoRequest);

    TodoResponse updateTodo(Long memberId, Long todoId, TodoRequest todoRequest);
}
