package com.eum.todo_service.domain.todo.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class TodoListResponse {
    private List<TodoResponse> completedTodoResponseList;
    private List<TodoResponse> notCompletedTodoResponseList;

    @Builder
    public TodoListResponse(List<TodoResponse> completedTodoResponseList
            , List<TodoResponse> notCompletedTodoResponseList) {
        this.completedTodoResponseList = completedTodoResponseList;
        this.notCompletedTodoResponseList = notCompletedTodoResponseList;
    }

    public static TodoListResponse from(List<TodoResponse> completedTodoResponseList,
                                        List<TodoResponse> notCompletedTodoResponseList) {
        return TodoListResponse.builder()
                .completedTodoResponseList(completedTodoResponseList)
                .notCompletedTodoResponseList(notCompletedTodoResponseList)
                .build();

    }
}
