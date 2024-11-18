package com.eum.drawingservice.exception;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ErrorResponse {

	private String code;
	private String message;

	public static ErrorResponse create(ErrorCode errorCode) {
		return ErrorResponse.builder()
				.code(errorCode.getCode())
				.message(errorCode.getMessage())
				.build();
	}

	public static ErrorResponse create(String code, String message) {
		return ErrorResponse.builder()
				.code(code)
				.message(message)
				.build();
	}
}