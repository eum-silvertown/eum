package com.eum.user_service.global.exception;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ErrorResponse<T> {

	private String code;
	private String message;

	public static <T> ErrorResponse<T> error(ErrorCode errorCode) {
		return ErrorResponse.<T>builder()
			.code(errorCode.getCode())
			.message(errorCode.getMessage())
			.build();
	}
}