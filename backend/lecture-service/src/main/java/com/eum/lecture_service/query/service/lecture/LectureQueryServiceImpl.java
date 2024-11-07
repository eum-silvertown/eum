package com.eum.lecture_service.query.service.lecture;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.eum.lecture_service.config.exception.ErrorCode;
import com.eum.lecture_service.config.exception.EumException;
import com.eum.lecture_service.query.document.LectureModel;
import com.eum.lecture_service.query.dto.lecture.LectureDetailResponse;
import com.eum.lecture_service.query.dto.lecture.LectureListResponse;
import com.eum.lecture_service.query.repository.LectureReadRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LectureQueryServiceImpl implements LectureQueryService {

	private final LectureReadRepository lectureReadRepository;

	@Override
	public LectureDetailResponse getLectureDetail(Long lectureId) {
		LectureModel lecture = lectureReadRepository.findById(lectureId)
			.orElseThrow(() -> new EumException(ErrorCode.LECTURE_NOT_FOUND));

		return LectureDetailResponse.fromLectureModel(lecture);
	}

	//이거, 클래스id가 같은 거로 주는거로 바꾸장
	@Override
	public List<LectureListResponse> getLectureList(Long classId) {
		List<LectureModel> lectureList = lectureReadRepository.findByClassId(classId);
		return lectureList.stream()
			.map(LectureListResponse::fromLectureModel)
			.collect(Collectors.toList());
	}

	@Override
	public List<LectureListResponse> getLectureListByDay(String day, Long year, Long semester) {
		List<LectureModel> lectures = lectureReadRepository.findBySchedule_DayAndYearAndSemester(day, year, semester);
		return lectures.stream()
			.map(LectureListResponse::fromLectureModelWithPeriod)
			.collect(Collectors.toList());
	}
}
