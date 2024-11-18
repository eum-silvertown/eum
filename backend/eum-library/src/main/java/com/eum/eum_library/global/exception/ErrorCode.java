package com.eum.eum_library.global.exception;

import org.springframework.http.HttpStatus;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // Global Errors
    INTERNAL_SERVER_ERROR("S001", "내부 서버 오류", HttpStatus.INTERNAL_SERVER_ERROR),

    // Token Errors
    AUTHENTICATION_FAILED("A001", "인증에 실패했습니다.", HttpStatus.UNAUTHORIZED),
    NO_JWT_TOKEN("A002", "JWT 토큰이 없습니다.", HttpStatus.UNAUTHORIZED),
    INVALID_JWT_TOKEN("A003", "유효하지 않은 JWT 토큰입니다.", HttpStatus.UNAUTHORIZED),
    ACCESS_TOKEN_EXPIRED("A004", "Access Token이 만료되었습니다.", HttpStatus.UNAUTHORIZED),
    REFRESH_TOKEN_EXPIRED("A005", "Refresh Token이 만료되었습니다.", HttpStatus.UNAUTHORIZED),
    REFRESH_TOKEN_BLACKLISTED("A006", "블랙리스트에 등록된 Refresh Token입니다.", HttpStatus.UNAUTHORIZED),
    REFRESH_TOKEN_NOT_FOUND("A007", "Refresh Token을 찾을 수 없습니다.", HttpStatus.UNAUTHORIZED),
    ACCESS_TOKEN_BLACKLISTED("A008", "블랙리스트에 등록된 Access Token입니다.", HttpStatus.UNAUTHORIZED),

    // User Errors
    USER_REGISTER_FAILED("U001", "사용자 등록에 실패했습니다.", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND("U002", "사용자를 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    PASSWORD_NOT_MATCH("U003", "비밀번호가 일치하지 않습니다.", HttpStatus.BAD_REQUEST),
    USER_NOT_AUTHORIZED("U004", "해당 작업을 수행할 권한이 없습니다.", HttpStatus.FORBIDDEN),
    USER_ID_ALREADY_EXISTED("U005", "이미 존재하는 ID입니다.", HttpStatus.BAD_REQUEST),
    CLASS_TEACHER_ALREADY_EXISTED("U006", "이미 선생님이 등록된 반입니다.", HttpStatus.BAD_REQUEST),
    EMAIL_ALREADY_EXISTED("U007", "이미 등록된 이메일입니다.", HttpStatus.BAD_REQUEST),
    INVALID_ROLE("U008", "등록되지 않은 ROLE입니다.", HttpStatus.BAD_REQUEST),
    CLASS_NOT_FOUND("U009", "등록되지 않은 반 정보입니다.", HttpStatus.BAD_REQUEST),

    // Mail Errors
    MESSAGE_SEND_FAILED("M001", "메일 전송에 실패했습니다.", HttpStatus.INTERNAL_SERVER_ERROR),
    EMAIL_AUTHENTICATION_CODE_EXPIRED("M002", "만료된 인증 코드입니다.", HttpStatus.BAD_REQUEST),
    INVALID_EMAIL_AUTHENTICATION_CODE("M003", "잘못된 인증 코드입니다.", HttpStatus.BAD_REQUEST),

    // Lecture Errors
    AUTHORITY_PERMISSION_ERROR("C001", "권한 오류", HttpStatus.UNAUTHORIZED),
    SCHEDULE_CONFLICT("L001", "스케줄 중복", HttpStatus.BAD_REQUEST),
    LECTURE_NOT_FOUND("L002", "강의 없음", HttpStatus.BAD_REQUEST),
    NOTICE_NOT_FOUND("N001", "공지사항 없음", HttpStatus.BAD_REQUEST),
    LESSON_NOT_FOUND("L003", "레슨 없음", HttpStatus.BAD_REQUEST),
    LESSON_TITLE_DUPLICATE("L004", "레슨 제목 중복", HttpStatus.BAD_REQUEST),
    EXAM_NOT_FOUND("E001", "시험 없음", HttpStatus.BAD_REQUEST),
    EXAM_TIME_INVALID("E002", "시험 기간 아님", HttpStatus.BAD_REQUEST),
    EXAM_ALREADY_SUBMITTED("E003", "이미 제출한 시험", HttpStatus.BAD_REQUEST),
    EXAM_TITLE_DUPLICATE("E004", "시험 제목 중복", HttpStatus.BAD_REQUEST),
    EXAM_SUBMISSION_NOT_FOUND("E005", "제출한 시험 없음", HttpStatus.BAD_REQUEST),
    EXAM_PROBLEM_SUBMISSION_NOT_FOUND("E006", "제출한 시험 문제 없음", HttpStatus.BAD_REQUEST),
    HOMEWORK_NOT_FOUND("H001", "숙제 없음", HttpStatus.BAD_REQUEST),
    HOMEWORK_TIME_INVALID("H002", "숙제 제출 기간 지남", HttpStatus.BAD_REQUEST),
    HOMEWORK_TITLE_DUPLICATE("H003", "숙제 제목 중복", HttpStatus.BAD_REQUEST),
    HOMEWORK_SUBMISSION_NOT_FOUND("H004", "제출한 숙제 없음", HttpStatus.BAD_REQUEST),
    HOMEWORK_PROBLEM_SUBMISSION_NOT_FOUND("H005", "제출한 숙제 문제 없음", HttpStatus.BAD_REQUEST),
    TEACHER_NOT_FOUND("T001", "선생님 없음", HttpStatus.BAD_REQUEST),
    TEACHERMODEL_NOT_FOUND("T002", "선생님 모델 없음", HttpStatus.BAD_REQUEST),
    STUDENT_NOT_FOUND("S010", "학생 없음", HttpStatus.BAD_REQUEST),
    STUDENTMODEL_NOT_FOUND("S011", "학생 모델 없음", HttpStatus.BAD_REQUEST),

    // Drawing Errors
    DRAWING_HEADER_INVALID("D001", "헤더가 올바르지 않습니다.", HttpStatus.BAD_REQUEST),

    // Folder Errors
    FOLDER_NOT_FOUND_ERROR("F001", "해당 폴더를 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    FOLDER_ALREADY_EXISTS_ERROR("F002", "해당 폴더가 이미 존재합니다.", HttpStatus.BAD_REQUEST),
    ROOT_FOLDER_DELETE_ERROR("F003", "최상위 폴더는 삭제할 수 없습니다.", HttpStatus.BAD_REQUEST),
    ROOT_FOLDER_MOVE_ERROR("F004", "최상위 폴더는 이동할 수 없습니다.", HttpStatus.BAD_REQUEST),
    FILE_NOT_FOUND_ERROR("Q001", "해당 파일을 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    FILE_ALREADY_EXISTS_ERROR("Q002", "해당 파일이 이미 존재합니다.", HttpStatus.BAD_REQUEST),

    // Notification Errors
    FIREBASE_CONNECT_ERROR("F010", "파이어베이스 연결 오류", HttpStatus.INTERNAL_SERVER_ERROR),
    FIREBASE_SENDING_ERROR("F011", "메시지 전송 실패", HttpStatus.INTERNAL_SERVER_ERROR),
    NOTIFICATION_NOT_FOUND("N010", "알림 찾기 실패", HttpStatus.NOT_FOUND),
    FCM_TOKEN_NOT_FOUND("N011", "FCM 토큰 찾기 실패", HttpStatus.NOT_FOUND),

    // ToDo Errors
    TODO_NOT_FOUND("T010", "등록되지 않은 Todo 정보입니다.", HttpStatus.BAD_REQUEST);

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;
}
