package com.eum.lecture_service.query.service.homework;

import org.springframework.stereotype.Service;

import com.eum.lecture_service.config.exception.ErrorCode;
import com.eum.lecture_service.config.exception.EumException;
import com.eum.lecture_service.query.document.LectureModel;
import com.eum.lecture_service.query.document.lectureInfo.HomeworkInfo;
import com.eum.lecture_service.query.dto.homework.HomeworkInfoResponse;
import com.eum.lecture_service.query.repository.LectureReadRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HomeworkQueryServiceImpl implements HomeworkQueryService {

	private final LectureReadRepository lectureReadRepository;

	@Override
	public HomeworkInfoResponse getHomeworkDetail(Long lectureId, Long homeworkId) {
		LectureModel lecture = lectureReadRepository.findById(lectureId)
			.orElseThrow(() -> new EumException(ErrorCode.LECTURE_NOT_FOUND));

		HomeworkInfo homeworkInfo = lecture.getHomeworks().stream()
			.filter(hw -> hw.getHomeworkId().equals(homeworkId))
			.findFirst()
			.orElseThrow(() -> new EumException(ErrorCode.HOMEWORK_NOT_FOUND));

		return HomeworkInfoResponse.fromHomework(homeworkInfo);
	}
}
