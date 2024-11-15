package com.eum.notification_service.dto.request;

import java.util.List;

import lombok.Getter;

@Getter
public class NotificationReadDto {

	List<Long> notificationIds;
}
