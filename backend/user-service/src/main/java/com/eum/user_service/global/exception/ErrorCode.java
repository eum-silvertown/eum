package com.eum.user_service.global.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // Server
    INTERNAL_SERVER_ERROR("S001", "내부 서버 오류", HttpStatus.INTERNAL_SERVER_ERROR),

    //user
    USER_REGISTER_FAILED("U001", "사용자 등록에 실패했습니다.", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND("U002","사용자를 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    PASSWORD_NOT_MATCH("U003","비밀번호가 일치하지 않습니다.", HttpStatus.BAD_REQUEST),
    USER_NOT_AUTHORIZED("U004","해당 작업을 수행할 권한이 없습니다.", HttpStatus.FORBIDDEN),
    USER_ID_ALREADY_EXISTED("U005","이미 존재하는 ID 입니다.", HttpStatus.BAD_REQUEST),
    CLASS_TEACHER_ALREADY_EXISTED("U006","이미 선생님이 등록된 반 입니다.", HttpStatus.BAD_REQUEST),
    EMAIL_ALREADY_EXISTED("U007","이미 등록된 이메일 입니다.", HttpStatus.BAD_REQUEST),
    INVALID_ROLE("U008","등록되지 않은 ROLE 입니다.", HttpStatus.BAD_REQUEST),
    CLASS_NOT_FOUND("U009","등록되지 않은 반 정보 입니다.", HttpStatus.BAD_REQUEST),
    //mail
    MESSAGE_SEND_FAILED("M001", "메일 전송에 실패했습니다.", HttpStatus.INTERNAL_SERVER_ERROR),
    EMAIL_AUTHENTICATION_CODE_EXPIRED("M002", "만료된 인증 코드입니다.", HttpStatus.BAD_REQUEST),
    INVALID_EMAIL_AUTHENTICATION_CODE("M003", "잘못된 인증 코드입니다.", HttpStatus.BAD_REQUEST),
    //token
    AUTHENTICATION_FAILED("A001", "인증에 실패했습니다.", HttpStatus.UNAUTHORIZED),
    NO_JWT_TOKEN("A002", "JWT 토큰이 없습니다.", HttpStatus.UNAUTHORIZED),
    INVALID_JWT_TOKEN("A003", "유효하지 않은 JWT 토큰입니다.", HttpStatus.UNAUTHORIZED),
    ACCESS_TOKEN_EXPIRED("A004", "Access Token이 만료되었습니다.", HttpStatus.UNAUTHORIZED),
    REFRESH_TOKEN_EXPIRED("A005", "Refresh Token이 만료되었습니다.", HttpStatus.UNAUTHORIZED),
    REFRESH_TOKEN_BLACKLISTED("A006", "블랙리스트에 등록된 Refresh Token입니다.", HttpStatus.UNAUTHORIZED),
    REFRESH_TOKEN_NOT_FOUND("A007", "Refresh Token을 찾을 수 없습니다.", HttpStatus.UNAUTHORIZED);



    private final String code;
    private final String message;
    private final HttpStatus httpStatus;
}
