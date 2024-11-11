package com.eum.notification_service.config.kafka;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.eum.notification_service.dto.LectureNotificationEvent;
import com.eum.notification_service.service.NotificationService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LectureNotificationListener {

    private final NotificationService notificationService;

    @KafkaListener(topics = "notification-topic", groupId = "notification-group", properties = {
        "spring.json.value.default.type=com.eum.notification_service.dto.LectureNotificationEvent"
    })
    public void onLectureNotificationEvent(LectureNotificationEvent event) {
        notificationService.sendLectureNotification(event);
    }
}