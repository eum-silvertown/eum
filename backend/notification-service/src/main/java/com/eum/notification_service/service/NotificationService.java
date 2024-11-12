package com.eum.notification_service.service;

import java.util.List;

import com.eum.notification_service.dto.NotificationDto;
import com.eum.notification_service.event.event.ExamCreatedEvent;
import com.eum.notification_service.event.event.HomeworkCreatedEvent;
import com.eum.notification_service.event.event.LectureCreatedEvent;
import com.eum.notification_service.event.event.LectureStartedEvent;

public interface NotificationService {

	void saveFCMToken(String token, Long memberId);

	void deleteFCMToken(Long memberId);

	void sendLectureCreatedNotifications(LectureCreatedEvent event);

	void sendLectureStatusUpdatedNotifications(LectureStartedEvent event);

	void sendExamCreatedNotifications(ExamCreatedEvent event);

	void sendHomeworkCreatedNotifications(HomeworkCreatedEvent event);

	// 알림 조회, 읽음 처리 등 추가 메서드
	List<NotificationDto> getUnreadNotifications(Long memberId);

	void markAsRead(Long notificationId, Long memberId);
}
