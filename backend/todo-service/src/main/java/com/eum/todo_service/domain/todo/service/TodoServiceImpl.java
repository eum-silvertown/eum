package com.eum.todo_service.domain.todo.service;

import com.eum.todo_service.domain.todo.dto.TodoRequest;
import com.eum.todo_service.domain.todo.dto.TodoResponse;
import com.eum.todo_service.domain.todo.entity.Todo;
import com.eum.todo_service.domain.todo.repository.TodoRepository;
import com.eum.todo_service.global.exception.ErrorCode;
import com.eum.todo_service.global.exception.EumException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Override
    @Transactional
    public TodoResponse updateTodo(Long memberId, Long todoId, TodoRequest todoRequest) {
        Todo todo = todoRepository.findById(todoId)
                .orElseThrow(() -> new EumException(ErrorCode.TODO_NOT_FOUND));
        if(todo.getMemberId() != memberId){
            throw new EumException(ErrorCode.USER_NOT_AUTHORIZED);
        }
        todo.updateTodo(todoRequest);
        return null;
    }
}
