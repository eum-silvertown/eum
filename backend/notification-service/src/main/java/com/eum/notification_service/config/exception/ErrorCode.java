package com.eum.notification_service.config.exception;

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
	;

	private final String code;
	private final String message;
	private final HttpStatus httpStatus;
}

