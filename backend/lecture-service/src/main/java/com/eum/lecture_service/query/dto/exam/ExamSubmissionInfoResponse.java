package com.eum.lecture_service.query.dto.exam;

import java.util.List;
import java.util.stream.Collectors;

import com.eum.lecture_service.query.document.studentInfo.ExamSubmissionInfo;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ExamSubmissionInfoResponse {

	private Long examSubmissionId;
	private Long examId;
	private Double score;
	private Long correctCount;
	private Long totalCount;
	private Boolean isCompleted;
	private List<ExamProblemSubmissionInfoResponse> problemSubmissions;

	public static ExamSubmissionInfoResponse fromExamSubmission(ExamSubmissionInfo examSubmissionInfo) {
		return ExamSubmissionInfoResponse.builder()
			.examSubmissionId(examSubmissionInfo.getExamSubmissionId())
			.examId(examSubmissionInfo.getExamId())
			.score(examSubmissionInfo.getScore())
			.correctCount(examSubmissionInfo.getCorrectCount())
			.totalCount(examSubmissionInfo.getTotalCount())
			.isCompleted(examSubmissionInfo.getIsCompleted())
			.problemSubmissions(
				examSubmissionInfo.getProblemSubmissions().stream()
					.map(ExamProblemSubmissionInfoResponse::fromExamProblemSubmission)
					.collect(Collectors.toList())
			)
			.build();
	}
}
