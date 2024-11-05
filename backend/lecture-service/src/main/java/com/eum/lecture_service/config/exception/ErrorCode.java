package com.eum.lecture_service.config.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

	// Server
	INTERNAL_SERVER_ERROR("S001", "내부 서버 오류", HttpStatus.INTERNAL_SERVER_ERROR),

	// Commoon
	AUTHORITY_PERMISSION_ERROR("C001", "권한 오류", HttpStatus.UNAUTHORIZED),

	// Lecture
	SCHEDULE_CONFLICT("L001", "스케줄 중복", HttpStatus.BAD_REQUEST),
	LECTURE_NOT_FOUND("L002", "스케줄 없음", HttpStatus.BAD_REQUEST),

	// Notice
	NOTICE_NOT_FOUND("N001", "공지사항 없음", HttpStatus.BAD_REQUEST),

	// Folder
	FOLDER_NOT_FOUND("F001", "폴더 없음", HttpStatus.BAD_REQUEST),
	FOLDER_ITEM_NOT_FOUND("F002", "폴더 아이템 없음", HttpStatus.BAD_REQUEST),

	// Exam
	EXAM_NOT_FOUND("E001", "시험 없음" , HttpStatus.BAD_REQUEST),
	EXAM_TIME_INVALID("E002", "시험 기간 아님", HttpStatus.BAD_REQUEST),
	EXAM_ALREADY_SUBMITTED("E003","이미 제출한 시험", HttpStatus.BAD_REQUEST),;

	private final String code;
	private final String message;
	private final HttpStatus httpStatus;
}

