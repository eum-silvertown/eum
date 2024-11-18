package com.eum.todo_service.domain.homework_todo.entity;

import com.eum.todo_service.domain.event.dto.HomeworkTodoCreateEvent;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@Document(collection = "homework_todo")
public class HomeworkTodo {

    private Long studentId;
    private Long homeworkId;
    private Long lectureId;
    private String lectureTitle;
    private String subject;
    private String title;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @Builder
    public HomeworkTodo(Long studentId, Long homeworkId, Long lectureId, String lectureTitle,
                        String subject, String title, LocalDateTime startTime, LocalDateTime endTime) {
        this.studentId = studentId;
        this.homeworkId = homeworkId;
        this.lectureId = lectureId;
        this.lectureTitle = lectureTitle;
        this.subject = subject;
        this.title = title;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public static HomeworkTodo from(HomeworkTodoCreateEvent homeworkTodoCreateEvent, Long studentId) {
        return HomeworkTodo.builder()
                .studentId(studentId)
                .homeworkId(homeworkTodoCreateEvent.getHomeworkId())
                .lectureId(homeworkTodoCreateEvent.getLectureId())
                .lectureTitle(homeworkTodoCreateEvent.getLectureTitle())
                .subject(homeworkTodoCreateEvent.getSubject())
                .title(homeworkTodoCreateEvent.getTitle())
                .startTime(homeworkTodoCreateEvent.getStartTime())
                .endTime(homeworkTodoCreateEvent.getEndTime())
                .build();
    }
}
