package com.eum.todo_service.domain.event.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HomeworkTodoDeleteEvent {
    private Long studentId;
    private Long homeworkId;
}
