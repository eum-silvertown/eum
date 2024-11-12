package com.eum.notification_service.common.exception;

import org.springframework.http.HttpStatus;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

	// Server
	INTERNAL_SERVER_ERROR("S001", "내부 서버 오류", HttpStatus.INTERNAL_SERVER_ERROR),

	// Firebase
	FIREBASE_CONNECT_ERROR("F001", "파이어베이스 연결 오류", HttpStatus.INTERNAL_SERVER_ERROR),
	FIREBASE_SENDING_ERROR("F002", "메시지 전송 실패", HttpStatus.INTERNAL_SERVER_ERROR),

	AUTHORITY_PERMISSION_ERROR("C001", "권한 오류", HttpStatus.UNAUTHORIZED),

	// Notification
	NOTIFICATION_NOT_FOUND("N001", "알림 찾기 실패", HttpStatus.NOT_FOUND),
	FCM_TOKEN_NOT_FOUND("N002", "FCM 토큰 찾기 실패", HttpStatus.NOT_FOUND),
	;

	private final String code;
	private final String message;
	private final HttpStatus httpStatus;
}

