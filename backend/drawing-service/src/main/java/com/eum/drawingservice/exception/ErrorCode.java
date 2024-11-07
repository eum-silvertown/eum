package com.eum.drawingservice.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // Server
    INTERNAL_SERVER_ERROR("S001", "내부 서버 오류", HttpStatus.INTERNAL_SERVER_ERROR),

    // Drawing
    DRAWING_HEADER_INVALID("D001", "헤더가 올바르지 않습니다.", HttpStatus.BAD_REQUEST),
    ;

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;
}
