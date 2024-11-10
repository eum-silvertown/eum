package com.eum.lecture_service.query.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eum.lecture_service.command.service.homework.HomeworkService;
import com.eum.lecture_service.common.RoleType;
import com.eum.lecture_service.config.exception.ErrorCode;
import com.eum.lecture_service.config.exception.EumException;
import com.eum.lecture_service.config.global.CommonResponse;
import com.eum.lecture_service.query.document.lectureInfo.HomeworkInfo;
import com.eum.lecture_service.query.document.studentInfo.HomeworkProblemSubmissionInfo;
import com.eum.lecture_service.query.document.studentInfo.HomeworkSubmissionInfo;
import com.eum.lecture_service.query.dto.homework.HomeworkInfoResponse;
import com.eum.lecture_service.query.dto.homework.HomeworkProblemSubmissionInfoResponse;
import com.eum.lecture_service.query.dto.homework.HomeworkSubmissionInfoResponse;
import com.eum.lecture_service.query.service.homework.HomeworkQueryService;
import com.eum.lecture_service.query.service.homework.HomeworkSubmissionQueryService;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/homework")
public class HomeworkQueryController {

	private final HomeworkQueryService homeworkQueryService;
	private final HomeworkSubmissionQueryService homeworkSubmissionQueryService;

	//숙제 상세 조회
	@GetMapping("/{lectureId}/{homeworkId}")
	public CommonResponse<?> getHomeworkDetail(
		@RequestHeader("X-MEMBER-ROLE") String role,
		@RequestHeader("X-MEMBER-ID") Long memberId,
		@PathVariable Long lectureId,
		@PathVariable Long homeworkId) {

		HomeworkInfoResponse response = homeworkQueryService.getHomeworkDetail(lectureId, homeworkId);
		return CommonResponse.success(response, "숙제 상세 조회 성공");
	}

	//특정 숙제에 대한 모든 제출 조회
	@GetMapping("/{lectureId}/{homeworkId}/submissions")
	public CommonResponse<?> getHomeworkSubmissions(
		@RequestHeader("X-MEMBER-ROLE") String role,
		@RequestHeader("X-MEMBER-ID") Long memberId,
		@PathVariable Long lectureId,
		@PathVariable Long homeworkId) {

		checkTeacherRole(role);

		List<HomeworkSubmissionInfoResponse> response = homeworkSubmissionQueryService.getHomeworkSubmissions(
			lectureId, homeworkId);
		return CommonResponse.success(response, "숙제 제출 내역 조회 성공");
	}

	// 특정 학생의 숙제 제출 내역 조회
	@GetMapping("/{lectureId}/{homeworkId}/submissions/{studentId}")
	public CommonResponse<?> getStudentHomeworkSubmission(
		@RequestHeader("X-MEMBER-ROLE") String role,
		@RequestHeader("X-MEMBER-ID") Long memberId,
		@PathVariable Long lectureId,
		@PathVariable Long homeworkId,
		@PathVariable Long studentId) {

		checkAccessPermission(role, memberId, studentId);

		HomeworkSubmissionInfoResponse response = homeworkSubmissionQueryService.getStudentHomeworkSubmission(
			lectureId, homeworkId, studentId);
		return CommonResponse.success(response, "학생의 숙제 제출 내역 조회 성공");
	}

	// 특정 문제 제출 정보 조회
	@GetMapping("/{lectureId}/{homeworkId}/submissions/{studentId}/problems/{problemId}")
	public CommonResponse<?> getHomeworkProblemSubmission(
		@RequestHeader("X-MEMBER-ROLE") String role,
		@RequestHeader("X-MEMBER-ID") Long memberId,
		@PathVariable Long lectureId,
		@PathVariable Long homeworkId,
		@PathVariable Long studentId,
		@PathVariable Long problemId) {

		checkAccessPermission(role, memberId, studentId);

		HomeworkProblemSubmissionInfoResponse response = homeworkSubmissionQueryService.getHomeworkProblemSubmission(
			lectureId, homeworkId, studentId, problemId);

		return CommonResponse.success(response, "숙제 문제 제출 정보 조회 성공");
	}

	// 특정 학생의 모든 숙제 제출 내역 조회
	@GetMapping("/{lectureId}/student/{studentId}/submissions")
	public CommonResponse<?> getAllHomeworkSubmissionsByStudent(
		@RequestHeader("X-MEMBER-ROLE") String role,
		@RequestHeader("X-MEMBER-ID") Long memberId,
		@PathVariable Long lectureId,
		@PathVariable Long studentId) {

		checkAccessPermission(role, memberId, studentId);

		List<HomeworkSubmissionInfoResponse> response = homeworkSubmissionQueryService.getAllHomeworkSubmissionsByStudent(
			lectureId, studentId);
		return CommonResponse.success(response, "특정 학생의 모든 숙제 제출 내역 조회 성공");
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
