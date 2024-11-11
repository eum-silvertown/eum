package com.eum.todo_service.domain.todo.dto;

import com.eum.todo_service.domain.todo.entity.Todo;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class TodoResponse {
    private Long id;
    private String title;
    private String content;
    private Integer priority;
    private LocalDateTime createdAt;
    private Boolean isDone;

    @Builder
    public TodoResponse(Long id, String title, String content,
                        Integer priority, LocalDateTime createdAt, Boolean isDone) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.priority = priority;
        this.createdAt = createdAt;
        this.isDone = isDone;
    }

    public static TodoResponse from(Todo todo) {
        return TodoResponse.builder()
                .id(todo.getId())
                .title(todo.getTitle())
                .content(todo.getContent())
                .priority(todo.getPriority())
                .createdAt(todo.getCreatedAt())
                .isDone(todo.getIsDone())
                .build();

    }
}
