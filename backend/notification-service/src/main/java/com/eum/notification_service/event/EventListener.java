package com.eum.notification_service.event;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.eum.notification_service.event.event.ExamCreatedNotificationEvent;
import com.eum.notification_service.event.event.HomeworkCreatedNotificationEvent;
import com.eum.notification_service.event.event.LectureCreatedNotificationEvent;
import com.eum.notification_service.event.event.LectureStartedNotificationEvent;
import com.eum.notification_service.service.NotificationService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EventListener {

	private final NotificationService notificationService;

	@KafkaListener(topics = "lecture-created-topic", groupId = "notification-group", properties = {
		"spring.json.value.default.type=com.eum.notification_service.event.event.LectureCreatedNotificationEvent"
	})
	public void handleLectureCreated(LectureCreatedNotificationEvent event) {
		notificationService.sendLectureCreatedNotifications(event);
	}

	@KafkaListener(topics = "lecture-started-topic", groupId = "notification-group", properties = {
		"spring.json.value.default.type=com.eum.notification_service.event.event.LectureStartedNotificationEvent"
	})
	public void handleLectureStatusUpdated(LectureStartedNotificationEvent event) {
		notificationService.sendLectureStatusUpdatedNotifications(event);
	}

	@KafkaListener(topics = "exam-created-topic", groupId = "notification-group", properties = {
		"spring.json.value.default.type=com.eum.notification_service.event.event.ExamCreatedNotificationEvent"
	})
	public void handleExamCreated(ExamCreatedNotificationEvent event) {
		notificationService.sendExamCreatedNotifications(event);
	}

	@KafkaListener(topics = "homework-created-topic", groupId = "notification-group", properties = {
		"spring.json.value.default.type=com.eum.notification_service.event.event.HomeworkCreatedNotificationEvent"
	})
	public void handleHomeworkCreated(HomeworkCreatedNotificationEvent event) {
		notificationService.sendHomeworkCreatedNotifications(event);
	}
}
