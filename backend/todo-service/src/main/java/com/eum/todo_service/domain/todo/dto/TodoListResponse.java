package com.eum.todo_service.domain.todo.dto;

import com.eum.todo_service.domain.homework_todo.dto.HomeworkTodoResponse;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class TodoListResponse {
    private List<TodoResponse> completedTodoResponseList;
    private List<TodoResponse> notCompletedTodoResponseList;
    private List<HomeworkTodoResponse> homeworkTodoResponseList;

    @Builder
    public TodoListResponse(List<TodoResponse> completedTodoResponseList,
                            List<TodoResponse> notCompletedTodoResponseList,
                            List<HomeworkTodoResponse> homeworkTodoResponseList) {
        this.completedTodoResponseList = completedTodoResponseList;
        this.notCompletedTodoResponseList = notCompletedTodoResponseList;
        this.homeworkTodoResponseList = homeworkTodoResponseList;
    }

    public static TodoListResponse from(List<TodoResponse> completedTodoResponseList,
                                        List<TodoResponse> notCompletedTodoResponseList,
                                        List<HomeworkTodoResponse> homeworkTodoResponseList) {
        return TodoListResponse.builder()
                .completedTodoResponseList(completedTodoResponseList)
                .notCompletedTodoResponseList(notCompletedTodoResponseList)
                .homeworkTodoResponseList(homeworkTodoResponseList)
                .build();

    }
}
