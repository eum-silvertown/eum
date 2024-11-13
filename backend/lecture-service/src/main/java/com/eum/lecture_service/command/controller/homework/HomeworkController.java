package com.eum.lecture_service.command.controller.homework;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eum.lecture_service.command.dto.homework.HomeworkDto;
import com.eum.lecture_service.command.dto.homework.HomeworkProblemSubmissionDto;
import com.eum.lecture_service.command.entity.homework.HomeworkSubmission;
import com.eum.lecture_service.command.service.homework.HomeworkService;
import com.eum.lecture_service.command.service.homework.HomeworkSubmissionService;
import com.eum.lecture_service.common.RoleType;
import com.eum.lecture_service.config.exception.ErrorCode;
import com.eum.lecture_service.config.exception.EumException;
import com.eum.lecture_service.config.global.CommonResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/homework")
@RequiredArgsConstructor
public class HomeworkController {

	private final HomeworkService homeworkService;
	private final HomeworkSubmissionService homeworkSubmissionService;

	// 숙제 생성
	@PostMapping
	public CommonResponse<?> createHomework(
		@RequestHeader("X-MEMBER-ROLE") String role,
		@RequestBody HomeworkDto homeworkDto) {
		try {
			RoleType roleType = RoleType.fromString(role);
			if (roleType == RoleType.STUDENT) {
				throw new EumException(ErrorCode.AUTHORITY_PERMISSION_ERROR);
			}
			Long homeworkId = homeworkService.createHomework(homeworkDto);
			return CommonResponse.success(homeworkId, "숙제 생성 성공");
		} catch (IllegalArgumentException e) {
			throw new EumException(ErrorCode.AUTHORITY_PERMISSION_ERROR);
		}
	}

	// 숙제 수정
	@PutMapping("/{homeworkId}")
	public CommonResponse<?> updateHomework(
		@RequestHeader("X-MEMBER-ROLE") String role,
		@PathVariable Long homeworkId,
		@RequestBody HomeworkDto homeworkDto) {
		try {
			RoleType roleType = RoleType.fromString(role);
			if (roleType == RoleType.STUDENT) {
				throw new EumException(ErrorCode.AUTHORITY_PERMISSION_ERROR);
			}
			Long updateHomeworkId = homeworkService.updateHomework(homeworkId, homeworkDto);
			return CommonResponse.success(updateHomeworkId, "숙제 수정 성공");
		} catch (IllegalArgumentException e) {
			throw new EumException(ErrorCode.AUTHORITY_PERMISSION_ERROR);
		}
	}

	@DeleteMapping("/{homeworkId}")
	public CommonResponse<Void> deleteHomework(
		@RequestHeader("X-MEMBER-ROLE") String role,
		@PathVariable Long homeworkId) {
		try {
			RoleType roleType = RoleType.fromString(role);
			if (roleType == RoleType.STUDENT) {
				throw new EumException(ErrorCode.AUTHORITY_PERMISSION_ERROR);
			}
			homeworkService.deleteHomework(homeworkId);
			return CommonResponse.success("시험 삭제 성공");
		} catch (IllegalArgumentException e) {
			throw new EumException(ErrorCode.AUTHORITY_PERMISSION_ERROR);
		}
	}

	@PostMapping("/{homeworkId}/submission")
	public CommonResponse<?> createHomeworkSubmission(
		@RequestHeader("X-MEMBER-ROLE") String role,
		@RequestHeader("X-MEMBER-ID") Long studentId,
		@PathVariable Long homeworkId,
		@RequestBody List<HomeworkProblemSubmissionDto> homeworkProblemSubmissions) {
		try {
			RoleType roleType = RoleType.fromString(role);
			if (roleType == RoleType.TEACHER) {
				throw new EumException(ErrorCode.AUTHORITY_PERMISSION_ERROR);
			}
			Long id = homeworkSubmissionService.submitHomeworkProblems(homeworkId, studentId, homeworkProblemSubmissions);
			return CommonResponse.success(id, "제출 성공");
		} catch (IllegalArgumentException e) {
			throw new EumException(ErrorCode.AUTHORITY_PERMISSION_ERROR);
		}
	}

}
