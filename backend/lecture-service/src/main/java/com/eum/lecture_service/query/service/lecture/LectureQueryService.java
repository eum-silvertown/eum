package com.eum.lecture_service.query.service.lecture;

import java.util.List;

import com.eum.lecture_service.query.dto.lecture.LectureDetailResponse;
import com.eum.lecture_service.query.dto.lecture.LectureListResponse;

public interface LectureQueryService {

	LectureDetailResponse getLectureDetail(Long lectureId);

	List<LectureListResponse> getLectureList(Long classId);

	List<LectureListResponse> getLectureListByDay(String day, Long year, Long semester);
}
