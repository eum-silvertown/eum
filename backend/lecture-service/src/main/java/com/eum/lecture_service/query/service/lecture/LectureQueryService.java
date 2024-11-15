package com.eum.lecture_service.query.service.lecture;

import java.util.List;

import com.eum.lecture_service.query.document.eventModel.ClassModel;
import com.eum.lecture_service.query.dto.lecture.LectureDetailResponse;
import com.eum.lecture_service.query.dto.lecture.LectureListResponse;
import com.eum.lecture_service.query.dto.lecture.LectureUpdateResponse;
import com.eum.lecture_service.query.dto.lecture.TodayDto;

public interface LectureQueryService {

	LectureDetailResponse getLectureDetail(String role, Long memberId, Long lectureId);

	List<LectureListResponse> getLectureList(String role, Long memberId);

	List<LectureListResponse> getLectureListByDay(TodayDto todayDto, String role, Long memberId);

	LectureUpdateResponse getLectureForUpdate(Long lectureId);

	List<ClassModel> getAvailableClasses(String schoolName);
}
