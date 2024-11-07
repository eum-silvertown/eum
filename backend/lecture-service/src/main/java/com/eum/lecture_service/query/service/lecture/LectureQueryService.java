package com.eum.lecture_service.query.service.lecture;

import java.util.List;

import com.eum.lecture_service.query.dto.lecture.LectureDetailResponse;
import com.eum.lecture_service.query.dto.lecture.LectureListResponse;

public interface LectureQueryService {

	LectureDetailResponse getLectureDetail(String role, Long lectureId);

	List<LectureListResponse> getLectureList(String role, Long memberId);

	List<LectureListResponse> getLectureListByDay(String day, Long year, Long semester);
}
