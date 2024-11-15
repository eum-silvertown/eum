package com.eum.todo_service.domain.todo.service;

import com.eum.todo_service.domain.todo.dto.TodoListResponse;
import com.eum.todo_service.domain.todo.dto.TodoRequest;
import com.eum.todo_service.domain.todo.dto.TodoResponse;
import com.eum.todo_service.domain.todo.dto.TodoStatusUpdateRequest;
import com.eum.todo_service.domain.todo.entity.Todo;
import com.eum.todo_service.domain.todo.repository.TodoRepository;
import com.eum.todo_service.global.exception.ErrorCode;
import com.eum.todo_service.global.exception.EumException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

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
        Todo todo = validateTodo(memberId, todoId);
        todo.updateTodo(todoRequest);
        return TodoResponse.from(todo);
    }

    @Override
    public void deleteTodo(Long memberId, Long todoId) {
        Todo todo = validateTodo(memberId, todoId);
        todoRepository.delete(todo);
    }

    @Override
    public TodoListResponse getTodoList(Long memberId) {
       List<Todo> todoList = todoRepository.findByMemberIdOrderByPriorityAndUpdatedAtDesc(memberId);
        Map<Boolean, List<TodoResponse>> partitionedResponses = todoList.stream()
                .map(TodoResponse::from)
                .collect(Collectors.partitioningBy(TodoResponse::getIsDone));

        return TodoListResponse.from(partitionedResponses.get(true), partitionedResponses.get(false));
    }

    @Override
    @Transactional
    public TodoResponse updateTodoState(Long memberId, Long todoId, TodoStatusUpdateRequest todoStatusUpdateRequest) {
        Todo todo = validateTodo(memberId,todoId);
        todo.updateTodoStatus(todoStatusUpdateRequest);
        return TodoResponse.from(todo);
    }

    private Todo validateTodo(Long memberId, Long todoId) {
        Todo todo = todoRepository.findById(todoId)
                .orElseThrow(() -> new EumException(ErrorCode.TODO_NOT_FOUND));
        if(todo.getMemberId().equals(memberId)){
            throw new EumException(ErrorCode.USER_NOT_AUTHORIZED);
        }
        return todo;
    }
}
