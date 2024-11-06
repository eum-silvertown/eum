package com.eum.lecture_service.config.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@RestControllerAdvice
public class EumExceptionHandler {

	@ExceptionHandler(EumException.class)
	public ResponseEntity<ErrorResponse<?>> handleException(EumException e) {
		ErrorCode errorCode = e.getErrorCode();
		return new ResponseEntity<>(ErrorResponse.error(errorCode), errorCode.getHttpStatus());

	}
}
