package com.eum.lecture_service.event.event.notification;

import java.io.Serializable;
import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LectureNotificationEvent implements Serializable {
    private Long lectureId;
    private String lectureTitle;
    private List<Long> studentIds;
    private String message;
}