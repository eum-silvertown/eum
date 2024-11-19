package com.eum.apigatewayservice.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // Server
    INTERNAL_SERVER_ERROR("S001", "내부 서버 오류", HttpStatus.INTERNAL_SERVER_ERROR),
    //token
    AUTHENTICATION_FAILED("A001", "인증에 실패했습니다.", HttpStatus.UNAUTHORIZED),
    NO_JWT_TOKEN("A002", "JWT 토큰이 없습니다.", HttpStatus.UNAUTHORIZED),
    INVALID_JWT_TOKEN("A003", "유효하지 않은 JWT 토큰입니다.", HttpStatus.UNAUTHORIZED),
    ACCESS_TOKEN_EXPIRED("A004", "Access Token이 만료되었습니다.", HttpStatus.UNAUTHORIZED),
    REFRESH_TOKEN_EXPIRED("A005", "Refresh Token이 만료되었습니다.", HttpStatus.UNAUTHORIZED),
    REFRESH_TOKEN_BLACKLISTED("A006", "블랙리스트에 등록된 Refresh Token입니다.", HttpStatus.UNAUTHORIZED),
    REFRESH_TOKEN_NOT_FOUND("A007", "Refresh Token을 찾을 수 없습니다.", HttpStatus.UNAUTHORIZED),
    ACCESS_TOKEN_BLACKLISTED("A008", "블랙리스트에 등록된 Access Token입니다.", HttpStatus.UNAUTHORIZED);

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;
}
