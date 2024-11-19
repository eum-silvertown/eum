package com.eum.lecture_service.query.dto.exam;

import java.time.LocalDateTime;
import java.util.List;

import com.eum.lecture_service.query.document.lectureInfo.ExamInfo;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ExamInfoResponse {

	private Long examId;
	private String title;
	private LocalDateTime startTime;
	private LocalDateTime endTime;
	private List<Long> questionIds;

	public static ExamInfoResponse fromExam(ExamInfo exam) {
		return ExamInfoResponse.builder()
			.examId(exam.getExamId())
			.title(exam.getTitle())
			.startTime(exam.getStartTime())
			.endTime(exam.getEndTime())
			.questionIds(exam.getQuestions())
			.build();
	}
}
