package com.eum.lecture_service.config.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

	// Server
	INTERNAL_SERVER_ERROR("S001", "내부 서버 오류", HttpStatus.INTERNAL_SERVER_ERROR),

	// Lecture
	SCHEDULE_CONFLICT("L001", "스케줄 중복", HttpStatus.BAD_REQUEST),
	LECTURE_NOT_FOUND("L002", "스케줄 없음", HttpStatus.BAD_REQUEST);

	private final String code;
	private final String message;
	private final HttpStatus httpStatus;
}

