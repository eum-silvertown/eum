package com.eum.lecture_service.command.controller.lesson;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eum.lecture_service.command.dto.lesson.LessonDto;
import com.eum.lecture_service.command.repository.lesson.LessonRepository;
import com.eum.lecture_service.command.service.lesson.LessonService;
import com.eum.lecture_service.config.exception.ErrorCode;
import com.eum.lecture_service.config.exception.EumException;
import com.eum.lecture_service.config.global.CommonResponse;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/lesson")
public class LessonController {

	private final LessonService lessonService;

	@PostMapping
	public CommonResponse<?> createLesson(
		@RequestHeader("X-MEMBER-ROLE") String role,
		@RequestBody LessonDto lessonDto) {
		if(!role.equals("TEACHER")) {
			throw new EumException(ErrorCode.AUTHORITY_PERMISSION_ERROR);
		}
		Long lessonId = lessonService.createLesson(lessonDto);
		return CommonResponse.success(lessonId, "레슨 생성 성공");
	}

	@PutMapping
	public CommonResponse<?> updateLesson(
		@RequestHeader("X-MEMBER-ROLE") String role,
		@PathVariable Long lessonId,
		@RequestBody LessonDto lessonDto) {
		if(!role.equals("TEACHER")) {
			throw new EumException(ErrorCode.AUTHORITY_PERMISSION_ERROR);
		}
		Long updatedLessonId = lessonService.updateLesson(lessonId, lessonDto);
		return CommonResponse.success(updatedLessonId, "레슨 수정 성공");
	}

	@DeleteMapping
	public CommonResponse<?> deleteLesson(
		@RequestHeader("X-MEMBER-ROLE") String role,
		@PathVariable Long lessonId) {
		if(!role.equals("TEACHER")) {
			throw new EumException(ErrorCode.AUTHORITY_PERMISSION_ERROR);
		}
		lessonService.deleteLesson(lessonId);
		return CommonResponse.success("레슨 삭제 성공");
	}

}
