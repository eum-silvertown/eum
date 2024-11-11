package com.eum.notification_service.service;

import com.eum.notification_service.dto.LectureNotificationEvent;

public interface NotificationService {
	void sendLectureNotification(LectureNotificationEvent event);
}
