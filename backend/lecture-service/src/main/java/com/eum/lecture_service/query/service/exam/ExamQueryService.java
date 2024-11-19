package com.eum.lecture_service.query.service.exam;

import com.eum.lecture_service.query.dto.exam.ExamInfoResponse;

public interface ExamQueryService {

	ExamInfoResponse getExamDetail(Long lectureId, Long examId);
}
