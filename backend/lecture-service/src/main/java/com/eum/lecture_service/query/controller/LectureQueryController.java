package com.eum.lecture_service.query.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eum.lecture_service.config.global.CommonResponse;
import com.eum.lecture_service.query.dto.lecture.LectureDetailResponse;
import com.eum.lecture_service.query.dto.lecture.LectureListResponse;
import com.eum.lecture_service.query.dto.lecture.TodayDto;
import com.eum.lecture_service.query.service.lecture.LectureQueryService;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/lecture")
@RequiredArgsConstructor
public class LectureQueryController {

	private final LectureQueryService lectureQueryService;

	@GetMapping("/{lectureId}")
	public CommonResponse<?> getLecture(
		@RequestHeader("X-MEMBER-ROLE") String role,
		@RequestHeader("X-MEMBER-ID") Long memberId,
		@PathVariable Long lectureId) {
		LectureDetailResponse lectureDetail = lectureQueryService.getLectureDetail(role, memberId, lectureId);
		return CommonResponse.success(lectureDetail, "성공적 조회");
	}

	@GetMapping
	public CommonResponse<?> getLectures(
		@RequestHeader("X-MEMBER-ROLE") String role,
		@RequestHeader("X-MEMBER-ID") Long memberId) {
		List<LectureListResponse> lectureList = lectureQueryService.getLectureList(role, memberId);
		return CommonResponse.success(lectureList, "목록 조회 성공");
	}

	@GetMapping
	public CommonResponse<?> getLectures(
		@RequestHeader("X-MEMBER-ROLE") String role,
		@RequestHeader("X-MEMBER-ID") Long memberId,
		@RequestBody TodayDto todayDto) {
		List<LectureListResponse> lectureList = lectureQueryService.getLectureListByDay(todayDto, role, memberId);
		return CommonResponse.success(lectureList, "목록조회 성공");
	}
}
