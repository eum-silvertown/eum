package com.eum.todo_service.domain.todo.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class TodoListResponse {
    private List<TodoResponse> todoResponseList;

    @Builder
    public TodoListResponse(List<TodoResponse> todoResponseList) {
        this.todoResponseList = todoResponseList;
    }

    public static TodoListResponse from(List<TodoResponse> todoResponseList) {
        return TodoListResponse.builder()
                .todoResponseList(todoResponseList)
                .build();
    }
}
