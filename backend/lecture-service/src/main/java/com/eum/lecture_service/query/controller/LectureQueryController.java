package com.eum.lecture_service.query.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.eum.lecture_service.common.RoleType;
import com.eum.lecture_service.config.exception.ErrorCode;
import com.eum.lecture_service.config.exception.EumException;
import com.eum.lecture_service.config.global.CommonResponse;
import com.eum.lecture_service.query.document.eventModel.ClassModel;
import com.eum.lecture_service.query.dto.lecture.LectureDetailResponse;
import com.eum.lecture_service.query.dto.lecture.LectureListResponse;
import com.eum.lecture_service.query.dto.lecture.LectureUpdateResponse;
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

	@GetMapping("/day")
	public CommonResponse<?> getLectures(
		@RequestHeader("X-MEMBER-ROLE") String role,
		@RequestHeader("X-MEMBER-ID") Long memberId,
		@RequestParam("day") String day,
		@RequestParam("year") Long year,
		@RequestParam("semester") Long semester) {

		TodayDto todayDto = TodayDto.builder()
			.day(day)
			.year(year)
			.semester(semester)
			.build();

		List<LectureListResponse> lectureList = lectureQueryService.getLectureListByDay(todayDto, role, memberId);
		return CommonResponse.success(lectureList, "목록조회 성공");
	}


	//수정용 조회
	@GetMapping("/update/{lectureId}")
	public CommonResponse<?> getLectureForUpdate(
		@RequestHeader("X-MEMBER-ROLE") String role,
		@PathVariable Long lectureId) {
		try {
			RoleType roleType = RoleType.fromString(role);
			if (roleType == RoleType.STUDENT) {
				throw new EumException(ErrorCode.AUTHORITY_PERMISSION_ERROR);
			}
			LectureUpdateResponse lectureForUpdate = lectureQueryService.getLectureForUpdate(lectureId);
			return CommonResponse.success(lectureForUpdate, "수업 업데이트용 조회 성공");
		} catch (IllegalArgumentException e) {
			throw new EumException(ErrorCode.AUTHORITY_PERMISSION_ERROR);
		} catch (Exception e) {
			e.printStackTrace();
			throw new EumException(ErrorCode.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/classes")
	public CommonResponse<?> getAvailableClasses(@RequestParam String schoolName) {
		List<ClassModel> availableClasses = lectureQueryService.getAvailableClasses(schoolName);
		return CommonResponse.success(availableClasses, "수업 생성 가능한 반 조회");
	}
}
