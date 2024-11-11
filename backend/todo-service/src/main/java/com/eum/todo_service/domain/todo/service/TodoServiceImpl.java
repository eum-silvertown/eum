package com.eum.todo_service.domain.todo.service;

import com.eum.todo_service.domain.todo.dto.TodoRequest;
import com.eum.todo_service.domain.todo.dto.TodoResponse;
import com.eum.todo_service.domain.todo.entity.Todo;
import com.eum.todo_service.domain.todo.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TodoServiceImpl implements TodoService {

    private final TodoRepository todoRepository;


    @Override
    public TodoResponse createNewTodo(Long memberId, TodoRequest todoRequest) {
        Todo todo = Todo.from(todoRequest,memberId);
        todoRepository.save(todo);
        return TodoResponse.from(todo);
    }
}
