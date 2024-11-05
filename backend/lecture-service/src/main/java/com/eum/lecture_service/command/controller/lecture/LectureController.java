package com.eum.lecture_service.command.controller.lecture;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eum.lecture_service.command.dto.lecture.LectureDto;
import com.eum.lecture_service.command.service.lecture.LectureService;
import com.eum.lecture_service.config.exception.ErrorCode;
import com.eum.lecture_service.config.exception.EumException;
import com.eum.lecture_service.config.global.CommonResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/lecture")
@RequiredArgsConstructor
public class LectureController {

	private final LectureService lectureService;

	//수업 생성
	@PostMapping
	public CommonResponse<?> createLecture(@RequestHeader("X-MEMBER-ID") Long memberId,
		@RequestHeader("X-MEMBER-ROLE") String role,
		@RequestBody LectureDto lectureDto) {
		if(!role.equals("TEACHER")) {
			throw new EumException(ErrorCode.INTERNAL_SERVER_ERROR);
		}
		Long lectureId = lectureService.createLecture(lectureDto, memberId);
		return CommonResponse.success(lectureId, "수업 생성 성공");
	}

	//수업 수정
	@PutMapping("/{lectureId}")
	public CommonResponse<?> updateLecture(
		@RequestHeader("X-MEMBER-ROLE") String role,
		@PathVariable Long lectureId,  @RequestBody LectureDto lectureDto) {
		if(!role.equals("TEACHER")) {
			throw new EumException(ErrorCode.INTERNAL_SERVER_ERROR);
		}
		Long updateLectureId = lectureService.updateLecture(lectureDto, lectureId);
		return CommonResponse.success(updateLectureId, "수업 수정 성공");
	}

	//수업 삭제
	@DeleteMapping("/{lectureId}")
	public CommonResponse<?> deleteLecture(
		@RequestHeader("X-MEMBER-ROLE") String role,
		@PathVariable Long lectureId) {
		if(!role.equals("TEACHER")) {
			throw new EumException(ErrorCode.INTERNAL_SERVER_ERROR);
		}
		lectureService.deleteLecture(lectureId);
		return CommonResponse.success("수업 삭제 성공");
	}
}
