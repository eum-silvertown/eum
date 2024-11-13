package com.eum.notification_service.event;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.eum.notification_service.event.event.ExamCreatedNotificationEvent;
import com.eum.notification_service.event.event.HomeworkCreatedNotificationEvent;
import com.eum.notification_service.event.event.LectureCreatedNotificationEvent;
import com.eum.notification_service.event.event.LectureStartedNotificationEvent;
import com.eum.notification_service.service.NotificationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventListener {

	private final NotificationService notificationService;

	@KafkaListener(topics = "lecture-created-notification-topic", groupId = "notification-group", properties = {
		"spring.json.value.default.type=com.eum.notification_service.event.event.LectureCreatedNotificationEvent"
	})
	public void handleLectureCreated(LectureCreatedNotificationEvent event) {
		log.info("강의 생성 알림 요청 들어옴");
		notificationService.sendLectureCreatedNotifications(event);
	}

	@KafkaListener(topics = "lecture-started-notification-topic", groupId = "notification-group", properties = {
		"spring.json.value.default.type=com.eum.notification_service.event.event.LectureStartedNotificationEvent"
	})
	public void handleLectureStatusUpdated(LectureStartedNotificationEvent event) {
		log.info("강의 시작 알림 요청 들어옴");
		notificationService.sendLectureStatusUpdatedNotifications(event);
	}

	@KafkaListener(topics = "exam-created-notification-topic", groupId = "notification-group", properties = {
		"spring.json.value.default.type=com.eum.notification_service.event.event.ExamCreatedNotificationEvent"
	})
	public void handleExamCreated(ExamCreatedNotificationEvent event) {
		log.info("시험 생성 알림 요청 들어옴");
		notificationService.sendExamCreatedNotifications(event);
	}

	@KafkaListener(topics = "homework-created-notification-topic", groupId = "notification-group", properties = {
		"spring.json.value.default.type=com.eum.notification_service.event.event.HomeworkCreatedNotificationEvent"
	})
	public void handleHomeworkCreated(HomeworkCreatedNotificationEvent event) {
		log.info("숙제 생성 알림 요청 들어옴");
		notificationService.sendHomeworkCreatedNotifications(event);
	}
}
