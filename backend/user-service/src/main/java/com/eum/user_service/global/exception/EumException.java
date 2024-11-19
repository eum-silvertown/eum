package com.eum.user_service.global.exception;

import lombok.Getter;

@Getter
public class EumException extends RuntimeException {

    private final ErrorCode errorCode;

    public EumException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}
