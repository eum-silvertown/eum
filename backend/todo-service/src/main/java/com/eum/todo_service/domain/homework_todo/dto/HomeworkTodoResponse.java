package com.eum.todo_service.domain.homework_todo.dto;

import com.eum.todo_service.domain.homework_todo.entity.HomeworkTodo;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class HomeworkTodoResponse {
    private Long homeworkId;
    private Long lectureId;
    private String lectureTitle;
    private String subject;
    private String title;
    private String backgroundColor;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @Builder
    public HomeworkTodoResponse(Long homeworkId, Long lectureId, String lectureTitle, String subject,
                                String title, String backgroundColor, LocalDateTime startTime, LocalDateTime endTime) {
        this.homeworkId = homeworkId;
        this.lectureId = lectureId;
        this.lectureTitle = lectureTitle;
        this.subject = subject;
        this.title = title;
        this.backgroundColor = backgroundColor;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public static HomeworkTodoResponse from(HomeworkTodo homeworkTodo) {
        return HomeworkTodoResponse.builder()
                .homeworkId(homeworkTodo.getHomeworkId())
                .lectureId(homeworkTodo.getLectureId())
                .lectureTitle(homeworkTodo.getLectureTitle())
                .subject(homeworkTodo.getSubject())
                .title(homeworkTodo.getTitle())
                .backgroundColor(homeworkTodo.getBackgroundColor())
                .startTime(homeworkTodo.getStartTime())
                .endTime(homeworkTodo.getEndTime())
                .build();
    }
}
