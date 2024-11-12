package com.eum.notification_service.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.eum.notification_service.common.exception.ErrorCode;
import com.eum.notification_service.common.exception.EumException;
import com.eum.notification_service.dto.NotificationDto;
import com.eum.notification_service.entity.Notifications;
import com.eum.notification_service.event.event.ExamCreatedEvent;
import com.eum.notification_service.event.event.HomeworkCreatedEvent;
import com.eum.notification_service.event.event.LectureCreatedEvent;
import com.eum.notification_service.event.event.LectureStartedEvent;
import com.eum.notification_service.repository.NotificationRepository;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

	private static final String FCM_KEY_PREFIX = "fcm:member:";

	private final NotificationRepository notificationRepository;
	private final RedisTemplate<String, String> redisTemplate;

	@Override
	public void saveFCMToken(String token, Long memberId) {
		String key = FCM_KEY_PREFIX + memberId;
		redisTemplate.opsForHash().put(key, "fcmToken", token);
	}

	@Override
	public void deleteFCMToken(Long memberId) {
		String key = FCM_KEY_PREFIX + memberId;
		redisTemplate.delete(key);
	}

	@Override
	public void sendLectureCreatedNotifications(LectureCreatedEvent event) {
		String title = "새로운 강의가 생성되었습니다.";
		String message = "강의 제목 : " + event.getTitle();

		event.getStudentIds().forEach(studentId -> {

			sendFcmNotification(studentId, title, message);

			Notifications notification = Notifications.builder()
				.memberId(studentId)
				.title(title)
				.message(message)
				.isRead(false)
				.build();
			notificationRepository.save(notification);
		});
	}

	@Override
	public void sendLectureStatusUpdatedNotifications(LectureStartedEvent event) {
		String title = "강의가 시작되었습니다";
		String message = "강의 제목: " + event.getTitle();

		event.getStudentIds().forEach(studentId -> {

			sendFcmNotification(studentId, title, message);

			Notifications notification = Notifications.builder()
				.memberId(studentId)
				.title(title)
				.message(message)
				.isRead(false)
				.build();
			notificationRepository.save(notification);
		});
	}

	@Override
	public void sendExamCreatedNotifications(ExamCreatedEvent event) {
		String title = "새로운 시험이 등록되었습니다";
		String message = "시험 제목: " + event.getTitle();

		event.getStudentIds().forEach(studentId -> {

			sendFcmNotification(studentId, title, message);

			Notifications notification = Notifications.builder()
				.memberId(studentId)
				.title(title)
				.message(message)
				.isRead(false)
				.build();
			notificationRepository.save(notification);
		});
	}

	@Override
	public void sendHomeworkCreatedNotifications(HomeworkCreatedEvent event) {
		String title = "새로운 숙제가 등록되었습니다";
		String message = "숙제 제목: " + event.getTitle();

		event.getStudentIds().forEach(studentId -> {

			sendFcmNotification(studentId, title, message);

			Notifications notification = Notifications.builder()
				.memberId(studentId)
				.title(title)
				.message(message)
				.isRead(false)
				.build();
			notificationRepository.save(notification);
		});
	}

	@Override
	@Transactional(readOnly = true)
	public List<NotificationDto> getUnreadNotifications(Long memberId) {
		List<Notifications> notifications = notificationRepository.findByMemberIdAndIsReadFalse(memberId);
		return notifications.stream()
			.map(NotificationDto::fromEntity)
			.collect(Collectors.toList());
	}

	@Override
	public void markAsRead(Long notificationId, Long memberId) {
		Notifications notification = notificationRepository.findById(notificationId)
			.orElseThrow(() -> new EumException(ErrorCode.NOTIFICATION_NOT_FOUND));

		if (!notification.getMemberId().equals(memberId)) {
			throw new EumException(ErrorCode.AUTHORITY_PERMISSION_ERROR);
		}

		notification.setIsRead(true);
		notificationRepository.save(notification);
	}

	private void sendFcmNotification(Long memberId, String title, String body) {
		String fcmToken = getFcmTokenByMemberId(memberId);

		Message message = Message.builder()
				.setToken(fcmToken)
				.setNotification(Notification.builder()
						.setTitle(title)
						.setBody(body)
						.build())
				.build();

		try {
			String response = FirebaseMessaging.getInstance().send(message);
			System.out.println("FCM 메시지 응답: " + response);
		} catch (Exception e) {
			throw new EumException(ErrorCode.FIREBASE_SENDING_ERROR);
		}
	}

	private String getFcmTokenByMemberId(Long memberId) {
		String key = FCM_KEY_PREFIX + memberId;
		if(Boolean.FALSE.equals(redisTemplate.hasKey(key))) {
			throw new EumException(ErrorCode.FCM_TOKEN_NOT_FOUND);
		}
		return redisTemplate.opsForHash().get(key, "fcmToken").toString();
	}
}
