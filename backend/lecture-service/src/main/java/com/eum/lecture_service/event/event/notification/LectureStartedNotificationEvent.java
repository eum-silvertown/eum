package com.eum.lecture_service.event.event.notification;

import java.util.List;

import com.eum.lecture_service.command.entity.lecture.Lecture;
import com.eum.lecture_service.common.NotificationType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LectureStartedNotificationEvent  {
    private Long lectureId;
    private String title;
    private String subject;
    private List<Long> studentIds;
    private String type;

    public static LectureStartedNotificationEvent of(Lecture lecture, List<Long> studentIds) {
        return LectureStartedNotificationEvent.builder()
            .lectureId(lecture.getLectureId())
            .title(lecture.getTitle())
            .subject(lecture.getSubject())
            .studentIds(studentIds)
            .type(NotificationType.LECTURE_START.getDescription())
            .build();
    }
}