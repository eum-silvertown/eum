package com.eum.todo_service.domain.event.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HomeworkTodoCreateEvent {
    private Long homeworkId;
    private Long lectureId;
    private String lectureTitle;
    private String subject;
    private String title;
    private String backgroundColor;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private List<Long> studentIds;
}
