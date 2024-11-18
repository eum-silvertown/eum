package com.eum.notification_service.event.event;

import java.util.List;

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

}