package com.eum.eum_library.global.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class EumExceptionHandler {

    @ExceptionHandler(EumException.class)
    protected ResponseEntity<ErrorResponse<?>> handleCustomException(EumException e){
        ErrorCode errorCode = e.getErrorCode();
        return new ResponseEntity<>(ErrorResponse.error(errorCode), errorCode.getHttpStatus());
    }
}
