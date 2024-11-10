package com.eum.lecture_service.config.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

	// Server
	INTERNAL_SERVER_ERROR("S001", "내부 서버 오류", HttpStatus.INTERNAL_SERVER_ERROR),

	// Common
	AUTHORITY_PERMISSION_ERROR("C001", "권한 오류", HttpStatus.UNAUTHORIZED),

	// Lecture
	SCHEDULE_CONFLICT("L001", "스케줄 중복", HttpStatus.BAD_REQUEST),
	LECTURE_NOT_FOUND("L002", "강의 없음", HttpStatus.BAD_REQUEST),

	// Notice
	NOTICE_NOT_FOUND("N001", "공지사항 없음", HttpStatus.BAD_REQUEST),

	// Lesson
	LESSON_NOT_FOUND("L003", "레슨 없음", HttpStatus.BAD_REQUEST),
	LESSON_TITLE_DUPLICATE("L004", "시험 제목 중복", HttpStatus.BAD_REQUEST),

	// Exam
	EXAM_NOT_FOUND("E001", "시험 없음" , HttpStatus.BAD_REQUEST),
	EXAM_TIME_INVALID("E002", "시험 기간 아님", HttpStatus.BAD_REQUEST),
	EXAM_ALREADY_SUBMITTED("E003","이미 제출한 시험", HttpStatus.BAD_REQUEST),
	EXAM_TITLE_DUPLICATE("E004", "시험 제목 중복", HttpStatus.BAD_REQUEST),
	EXAM_SUBMISSION_NOT_FOUND("E005", "제출한 시험 없음", HttpStatus.BAD_REQUEST),
	EXAM_PROBLEM_SUBMISSION_NOT_FOUND("E006","제출한 시험 문제 없음" ,HttpStatus.BAD_REQUEST ),

	// HOMEWORK
	HOMEWORK_NOT_FOUND("H001", "숙제 없음" , HttpStatus.BAD_REQUEST ),
	HOMEWORK_TIME_INVALID("H002", "숙제 제출 기간 지남", HttpStatus.BAD_REQUEST),
	HOMEWORK_TITLE_DUPLICATE("H003", "숙제 제목 중복", HttpStatus.BAD_REQUEST),
	HOMEWORK_SUBMISSION_NOT_FOUND("H004", "제출한 숙제 없음", HttpStatus.BAD_REQUEST),
	HOMEWORK_PROBLEM_SUBMISSION_NOT_FOUND("H005","제출한 숙제 문제 없음" ,HttpStatus.BAD_REQUEST ),

	// Teacher
	TEACHER_NOT_FOUND("T001", "선생님 없음", HttpStatus.BAD_REQUEST),
	TEACHERMODEL_NOT_FOUND("T002", "선생님 모델 없음", HttpStatus.BAD_REQUEST),

	// Student
	STUDENT_NOT_FOUND("S001", "학생 없음", HttpStatus.BAD_REQUEST),
	STUDENTMODEL_NOT_FOUND("S002", "학생 모델 없음", HttpStatus.BAD_REQUEST),

	// Class
	CLASS_NOT_FOUND("C002","수업 없음" , HttpStatus.BAD_REQUEST),
	;

	private final String code;
	private final String message;
	private final HttpStatus httpStatus;
}

