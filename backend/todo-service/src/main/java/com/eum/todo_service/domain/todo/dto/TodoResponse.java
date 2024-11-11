package com.eum.todo_service.domain.todo.dto;

import lombok.Getter;

import java.time.LocalDate;

@Getter
public class TodoResponse {
    private Long id;
    private String title;
    private String content;
    private Integer priority;
    private LocalDate createdAt;
    private Boolean isDone;


}
