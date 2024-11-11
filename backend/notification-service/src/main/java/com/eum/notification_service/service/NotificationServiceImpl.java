package com.eum.notification_service.service;

import org.springframework.stereotype.Service;

import com.eum.notification_service.dto.LectureNotificationEvent;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

	@Override
	public void sendLectureNotification(LectureNotificationEvent event) {

	}
}
