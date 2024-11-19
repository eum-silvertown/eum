package com.eum.lecture_service.query.service.exam;

import org.springframework.stereotype.Service;

import com.eum.lecture_service.config.exception.ErrorCode;
import com.eum.lecture_service.config.exception.EumException;
import com.eum.lecture_service.query.document.LectureModel;
import com.eum.lecture_service.query.document.lectureInfo.ExamInfo;
import com.eum.lecture_service.query.dto.exam.ExamInfoResponse;
import com.eum.lecture_service.query.repository.LectureReadRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExamQueryServiceImpl implements ExamQueryService {

	private final LectureReadRepository lectureReadRepository;

	@Override
	public ExamInfoResponse getExamDetail(Long lectureId, Long examId) {
		LectureModel lecture = lectureReadRepository.findById(lectureId)
			.orElseThrow(() -> new EumException(ErrorCode.LECTURE_NOT_FOUND));

		ExamInfo examInfo = lecture.getExams().stream()
			.filter(exam -> exam.getExamId().equals(examId))
			.findFirst()
			.orElseThrow(() -> new EumException(ErrorCode.EXAM_NOT_FOUND));

		return ExamInfoResponse.fromExam(examInfo);
	}
}
