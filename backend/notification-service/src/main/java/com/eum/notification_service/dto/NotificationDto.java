package com.eum.notification_service.dto;

import java.time.LocalDateTime;

import com.eum.notification_service.entity.Notifications;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDto {

	private Long notificationId;
	private Long memberId;
	private String title;
	private String message;
	private Boolean isRead;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;

	public static NotificationDto fromEntity(Notifications notification) {
		return NotificationDto.builder()
			.notificationId(notification.getNotificationId())
			.memberId(notification.getMemberId())
			.title(notification.getTitle())
			.message(notification.getMessage())
			.isRead(notification.getIsRead())
			.createdAt(notification.getCreatedAt())
			.updatedAt(notification.getUpdatedAt())
			.build();

	}
}
