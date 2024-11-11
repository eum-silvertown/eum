package com.eum.notification_service.dto;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

@Data
public class LectureNotificationEvent implements Serializable {
    private Long lectureId;
    private String lectureTitle;
    private List<Long> studentIds;
    private String message;
}