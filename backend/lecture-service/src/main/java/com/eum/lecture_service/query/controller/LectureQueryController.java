package com.eum.lecture_service.query.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eum.lecture_service.config.global.CommonResponse;
import com.eum.lecture_service.query.dto.lecture.LectureDetailResponse;
import com.eum.lecture_service.query.service.lecture.LectureQueryService;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/lecture")
@RequiredArgsConstructor
public class LectureQueryController {

	private final LectureQueryService lectureQueryService;

	@GetMapping("/{lectureId}")
	public CommonResponse<?> getLecture(@PathVariable Long lectureId) {
		LectureDetailResponse lectureDetail = lectureQueryService.getLectureDetail(lectureId);
		return CommonResponse.success(lectureDetail, "성공적 조회");
	}
}
