package com.eum.notification_service.service;

import java.util.List;

import com.eum.notification_service.dto.NotificationDto;
import com.eum.notification_service.event.event.ExamCreatedNotificationEvent;
import com.eum.notification_service.event.event.HomeworkCreatedNotificationEvent;
import com.eum.notification_service.event.event.LectureCreatedNotificationEvent;
import com.eum.notification_service.event.event.LectureStartedNotificationEvent;

public interface NotificationService {

	void saveFCMToken(String token, Long memberId);

	void deleteFCMToken(Long memberId);

	void sendLectureCreatedNotifications(LectureCreatedNotificationEvent event);

	void sendLectureStatusUpdatedNotifications(LectureStartedNotificationEvent event);

	void sendExamCreatedNotifications(ExamCreatedNotificationEvent event);

	void sendHomeworkCreatedNotifications(HomeworkCreatedNotificationEvent event);

	// 알림 조회, 읽음 처리 등 추가 메서드
	List<NotificationDto> getUnreadNotifications(Long memberId);

	void markAsRead(Long notificationId, Long memberId);

	void markAsReadNotifications(List<Long> notificationIds, Long memberId);

	List<NotificationDto> getReadNotifications(Long memberId);

	void deleteNotification(Long notificationId, Long memberId);
}
