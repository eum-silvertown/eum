package com.eum.notification_service.dto;

import com.eum.notification_service.entity.Notifications;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class NotificationDto {
    private Long id;
    private String title;
    private String message;
    private boolean isRead;
    private String createdAt;
    private String updatedAt;

    public static NotificationDto fromEntity(Notifications notification) {
        return NotificationDto.builder()
            .id(notification.getNotificationId())
            .title(notification.getTitle())
            .message(notification.getMessage())
            .isRead(notification.getIsRead())
            .createdAt(notification.getCreatedAt().toString())
            .updatedAt(notification.getUpdatedAt().toString())
            .build();
    }
}
