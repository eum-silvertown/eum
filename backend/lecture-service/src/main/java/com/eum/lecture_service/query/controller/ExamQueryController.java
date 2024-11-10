package com.eum.lecture_service.query.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eum.lecture_service.common.RoleType;
import com.eum.lecture_service.config.exception.ErrorCode;
import com.eum.lecture_service.config.exception.EumException;
import com.eum.lecture_service.config.global.CommonResponse;
import com.eum.lecture_service.query.dto.exam.ExamInfoResponse;
import com.eum.lecture_service.query.dto.exam.ExamProblemSubmissionInfoResponse;
import com.eum.lecture_service.query.dto.exam.ExamSubmissionInfoResponse;
import com.eum.lecture_service.query.service.exam.ExamQueryService;
import com.eum.lecture_service.query.service.exam.ExamSubmissionQueryService;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/exam")
public class ExamQueryController {

	private final ExamQueryService examQueryService;
	private final ExamSubmissionQueryService examSubmissionQueryService;

	@GetMapping("/{lectureId}/{examId}")
	public CommonResponse<?> getExamDetail(
		@RequestHeader("X-MEMBER-ROLE") String role,
		@RequestHeader("X-MEMBER_ID") Long memberId,
		@PathVariable Long lectureId,
		@PathVariable Long examId) {

		ExamInfoResponse response = examQueryService.getExamDetail(lectureId, examId);
		return CommonResponse.success(response, "시험 상세 조회 성공");
	}

	//특정 시험에 대한 모든 제출 조회
	@GetMapping("/{lectureId}/{examId}/submissions")
	public CommonResponse<?> getExamSubmissions(
		@RequestHeader("X-MEMBER-ROLE") String role,
		@RequestHeader("X-MEMBER-ID") Long memberId,
		@PathVariable Long lectureId,
		@PathVariable Long examId) {

		checkTeacherRole(role);

		List<ExamSubmissionInfoResponse> responses = examSubmissionQueryService.getExamSubmissions(
			lectureId, examId);
		return CommonResponse.success(responses, "시험 제출 내역 조회 성공");
	}

	//특정 학생의 시험 제출 내역 조회
	@GetMapping("/{lectureId}/{examId}/submissions/{studentId}")
	public CommonResponse<?> getStudentHomeworkSubmission(
		@RequestHeader("X-MEMBER-ROLE") String role,
		@RequestHeader("X-MEMBER-ID") Long memberId,
		@PathVariable Long lectureId,
		@PathVariable Long examId,
		@PathVariable Long studentId) {

		checkAccessPermission(role, memberId, studentId);

		ExamSubmissionInfoResponse response = examSubmissionQueryService.getStudentExamSubmission(
			lectureId, examId, studentId);
		return CommonResponse.success(response, "학생의 시험 제출 내역 조회 성공");
	}

	// 특정 문제 제출 정보 조회
	@GetMapping("/{lectureId}/{examId}/submissions/{studentId}/problems/{problemId}")
	public CommonResponse<?> getHomeworkProblemSubmission(
		@RequestHeader("X-MEMBER-ROLE") String role,
		@RequestHeader("X-MEMBER-ID") Long memberId,
		@PathVariable Long lectureId,
		@PathVariable Long examId,
		@PathVariable Long studentId,
		@PathVariable Long problemId) {

		checkAccessPermission(role, memberId, studentId);

		ExamProblemSubmissionInfoResponse response = examSubmissionQueryService.getExamProblemSubmission(
			lectureId, examId, studentId, problemId);
		return CommonResponse.success(response, "시험 문제 제출 정보 조회 성공");
	}

	//특정 학생의 모든 숙제 제출 내역 조회
	@GetMapping("/{lectureId}/student/{studentId}/submissions")
	public CommonResponse<?> getAllHomeworkSubmissionsByStudent(
		@RequestHeader("X-MEMBER-ROLE") String role,
		@RequestHeader("X-MEMBER-ID") Long memberId,
		@PathVariable Long lectureId,
		@PathVariable Long studentId) {

		checkAccessPermission(role, memberId, studentId);

		List<ExamSubmissionInfoResponse> response = examSubmissionQueryService.getAllExamSubmissionsByStudent(
			lectureId, studentId);
		return CommonResponse.success(response, "특정 학생의 모든 시험 제출 내역 조회 성공");
	}

	// 역할이 TEACHER인지 확인하는 메서드
	private void checkTeacherRole(String role) {
		if (!isTeacher(role)) {
			throw new EumException(ErrorCode.AUTHORITY_PERMISSION_ERROR);
		}
	}

	private void checkAccessPermission(String role, Long memberId, Long studentId) {
		if (isStudent(role)) {
			if (!memberId.equals(studentId)) {
				throw new EumException(ErrorCode.AUTHORITY_PERMISSION_ERROR);
			}
		} else if (!isTeacher(role)) {
			throw new EumException(ErrorCode.AUTHORITY_PERMISSION_ERROR);
		}
	}

	private boolean isTeacher(String role) {
		try {
			return RoleType.fromString(role) == RoleType.TEACHER;
		} catch (IllegalArgumentException e) {
			throw new EumException(ErrorCode.AUTHORITY_PERMISSION_ERROR);
		}
	}

	private boolean isStudent(String role) {
		try {
			return RoleType.fromString(role) == RoleType.STUDENT;
		} catch (IllegalArgumentException e) {
			throw new EumException(ErrorCode.AUTHORITY_PERMISSION_ERROR);
		}
	}
}
