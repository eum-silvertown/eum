package com.eum.drawingservice.exception;

import lombok.Getter;

@Getter
public class DrawingException extends RuntimeException {

    private final ErrorCode errorCode;

    public DrawingException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}
