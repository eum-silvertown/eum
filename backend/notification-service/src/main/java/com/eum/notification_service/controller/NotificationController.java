package com.eum.notification_service.controller;

import java.util.List;

import com.eum.notification_service.dto.request.SaveTokenRequest;
import org.springframework.web.bind.annotation.*;

import com.eum.notification_service.common.CommonResponse;
import com.eum.notification_service.dto.NotificationDto;
import com.eum.notification_service.service.NotificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/notification")
public class NotificationController {

	private final NotificationService notificationService;

	@PostMapping
	public CommonResponse<?> saveFCMToken(
			@RequestBody SaveTokenRequest requestDTO,
			@RequestHeader("X-MEMBER-ID") Long memberId) {
		notificationService.saveFCMToken(requestDTO.getToken(), memberId);
		return CommonResponse.success("FCM Token 저장 성공");
	}

	@DeleteMapping
	public CommonResponse<?> deleteFCMToken(@RequestHeader("X-MEMBER-ID") Long memberId) {
		notificationService.deleteFCMToken(memberId);
		return CommonResponse.success("FCM Token 삭제 성공");
	}

	@GetMapping
	public CommonResponse<?> getNotifications(@RequestHeader("X-MEMBER-ID") Long memberId) {
		List<NotificationDto> response = notificationService.getUnreadNotifications(memberId);

		return CommonResponse.success(response, "조회 성공");
	}

	@PostMapping("/read/{notificationId}")
	public CommonResponse<?> markAsRead(@PathVariable Long notificationId, @RequestHeader("X-MEMBER-ID") Long memberId) {
		notificationService.markAsRead(notificationId, memberId);
		return CommonResponse.success("성공적으로 읽음 처리 성공");
	}
}
