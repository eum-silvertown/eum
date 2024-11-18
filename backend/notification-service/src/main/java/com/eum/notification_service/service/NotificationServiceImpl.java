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
import com.eum.notification_service.event.event.ExamCreatedNotificationEvent;
import com.eum.notification_service.event.event.HomeworkCreatedNotificationEvent;
import com.eum.notification_service.event.event.LectureCreatedNotificationEvent;
import com.eum.notification_service.event.event.LectureStartedNotificationEvent;
import com.eum.notification_service.repository.NotificationRepository;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements NotificationService {

	private static final String FCM_KEY_PREFIX = "fcm:member:";

	private final NotificationRepository notificationRepository;
	private final RedisTemplate<String, String> redisTemplate;
	private final FirebaseMessaging firebaseMessaging;

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

	@Transactional
	@Override
	public void sendLectureCreatedNotifications(LectureCreatedNotificationEvent event) {
		String title = "새로운 강의가 생성되었습니다.";
		String message = "강의 제목 : " + event.getTitle();

		event.getStudentIds().forEach(studentId -> {

			sendFcmNotification(studentId, title, message, event.getTitle(), event.getSubject());

			Notifications notification = Notifications.builder()
				.memberId(studentId)
				.title(title)
				.message(message)
				.type(event.getType())
				.isRead(false)
				.build();
			notificationRepository.save(notification);
		});
	}

	@Transactional
	@Override
	public void sendLectureStatusUpdatedNotifications(LectureStartedNotificationEvent event) {
		String title = "강의가 시작되었습니다";
		String message = "강의 제목: " + event.getTitle();

		event.getStudentIds().forEach(studentId -> {

			sendFcmNotification(studentId, title, message, event.getTitle(), event.getSubject());

			Notifications notification = Notifications.builder()
				.memberId(studentId)
				.title(title)
				.message(message)
				.type(event.getType())
				.isRead(false)
				.build();
			notificationRepository.save(notification);
		});
	}

	@Transactional
	@Override
	public void sendExamCreatedNotifications(ExamCreatedNotificationEvent event) {
		String title = "새로운 시험이 등록되었습니다";
		String message = "시험 제목: " + event.getTitle();

		event.getStudentIds().forEach(studentId -> {

			sendFcmNotification(studentId, title, message, event.getTitle(), event.getSubject());

			Notifications notification = Notifications.builder()
				.memberId(studentId)
				.title(title)
				.message(message)
				.type(event.getType())
				.isRead(false)
				.build();
			notificationRepository.save(notification);
		});
	}

	@Transactional
	@Override
	public void sendHomeworkCreatedNotifications(HomeworkCreatedNotificationEvent event) {
		String title = "새로운 숙제가 등록되었습니다";
		String message = "숙제 제목: " + event.getTitle();

		event.getStudentIds().forEach(studentId -> {

			sendFcmNotification(studentId, title, message, event.getTitle(), event.getSubject());

			Notifications notification = Notifications.builder()
				.memberId(studentId)
				.title(title)
				.message(message)
				.type(event.getType())
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
	@Transactional(readOnly = true)
	public List<NotificationDto> getReadNotifications(Long memberId) {
		List<Notifications> notifications = notificationRepository.findByMemberIdAndIsReadTrue(memberId);
		return notifications.stream()
			.map(NotificationDto::fromEntity)
			.collect(Collectors.toList());
	}

	@Override
	public void deleteNotification(Long notificationId, Long memberId) {
		Notifications notification = notificationRepository.findById(notificationId)
			.orElseThrow(() -> new EumException(ErrorCode.NOTIFICATION_NOT_FOUND));

		if (!notification.getMemberId().equals(memberId)) {
			throw new EumException(ErrorCode.AUTHORITY_PERMISSION_ERROR);
		}

		notificationRepository.delete(notification);
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

	@Override
	public void markAsReadNotifications(List<Long> notificationIds, Long memberId) {
		for(Long notificationId : notificationIds) {
			Notifications notification = notificationRepository.findById(notificationId)
				.orElseThrow(() -> new EumException(ErrorCode.NOTIFICATION_NOT_FOUND));

			if (!notification.getMemberId().equals(memberId)) {
				throw new EumException(ErrorCode.AUTHORITY_PERMISSION_ERROR);
			}

			notification.setIsRead(true);
			notificationRepository.save(notification);
		}
	}

	private void sendFcmNotification(Long memberId, String title, String body, String eventTitle, String subject) {
		String fcmToken = getFcmTokenByMemberId(memberId);
		if (fcmToken == null || fcmToken.isEmpty()) {
			log.warn("FCM 토큰이 존재하지 않습니다. memberId: " + memberId);
			return;
		}

		Message message = Message.builder()
			.setToken(fcmToken)
			.setNotification(Notification.builder()
				.setTitle(title)
				.setBody(body)
				.build())
			.putData("title", eventTitle)
			.putData("subject", subject)
			.build();

		try {
			String response = firebaseMessaging.send(message);
			log.info("FCM 메시지 응답: " + response);
		} catch (Exception e) {
			throw new EumException(ErrorCode.FIREBASE_SENDING_ERROR);
		}
	}

	private String getFcmTokenByMemberId(Long memberId) {
		String key = FCM_KEY_PREFIX + memberId;
		log.info("Redis에서 조회 중인 키: " + key);
		if (Boolean.FALSE.equals(redisTemplate.hasKey(key))) {
			log.warn("FCM 토큰이 존재하지 않습니다. memberId: " + memberId);
			return null;
		}
		Object token = redisTemplate.opsForHash().get(key, "fcmToken");
		return token != null ? token.toString() : null;
	}
}
