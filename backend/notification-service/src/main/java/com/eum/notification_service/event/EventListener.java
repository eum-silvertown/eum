package com.eum.notification_service.event;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.eum.notification_service.event.event.ExamCreatedEvent;
import com.eum.notification_service.event.event.HomeworkCreatedEvent;
import com.eum.notification_service.event.event.LectureCreatedEvent;
import com.eum.notification_service.event.event.LectureStartedEvent;
import com.eum.notification_service.service.NotificationService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EventListener {

	private final NotificationService notificationService;

	@KafkaListener(topics = "lecture-created-topic", groupId = "notification-group", containerFactory = "kafkaListenerContainerFactory")
	public void handleLectureCreated(LectureCreatedEvent event) {
		notificationService.sendLectureCreatedNotifications(event);
	}

	@KafkaListener(topics = "lecture-started-topic", groupId = "notification-group", containerFactory = "kafkaListenerContainerFactory")
	public void handleLectureStatusUpdated(LectureStartedEvent event) {
		notificationService.sendLectureStatusUpdatedNotifications(event);
	}

	@KafkaListener(topics = "exam-created-topic", groupId = "notification-group", containerFactory = "kafkaListenerContainerFactory")
	public void handleExamCreated(ExamCreatedEvent event) {
		notificationService.sendExamCreatedNotifications(event);
	}

	@KafkaListener(topics = "homework-created-topic", groupId = "notification-group", containerFactory = "kafkaListenerContainerFactory")
	public void handleHomeworkCreated(HomeworkCreatedEvent event) {
		notificationService.sendHomeworkCreatedNotifications(event);
	}
}
