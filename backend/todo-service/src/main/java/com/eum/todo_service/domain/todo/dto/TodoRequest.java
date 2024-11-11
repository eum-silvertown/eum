package com.eum.todo_service.domain.todo.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class TodoRequest {
    private String title;
    private String content;
    private Integer priority;

    @Builder
    public TodoRequest(String title, String content, Integer priority) {
        this.title = title;
        this.content = content;
        this.priority = priority;
    }
}
