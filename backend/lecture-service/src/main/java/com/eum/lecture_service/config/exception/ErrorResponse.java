package com.eum.lecture_service.config.exception;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ErrorResponse<T> {

	private String errorCode;
	private String message;

	public static <T> ErrorResponse<T> error(ErrorCode errorCode) {
		return ErrorResponse.<T>builder()
			.errorCode(errorCode.getCode())
			.message(errorCode.getMessage())
			.build();
	}
}
