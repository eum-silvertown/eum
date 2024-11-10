package com.eum.lecture_service.query.dto.exam;

import com.eum.lecture_service.query.document.studentInfo.ExamProblemSubmissionInfo;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ExamProblemSubmissionInfoResponse {

	private Long examProblemSubmissionId;
	private Long questionId;
	private Boolean isCorrect;
	private String examSolution;

	public static ExamProblemSubmissionInfoResponse fromExamProblemSubmission( ExamProblemSubmissionInfo examProblemSubmissionInfo) {
		return ExamProblemSubmissionInfoResponse.builder()
			.examProblemSubmissionId(examProblemSubmissionInfo.getExamProblemSubmissionId())
			.questionId(examProblemSubmissionInfo.getQuestionId())
			.isCorrect(examProblemSubmissionInfo.getIsCorrect())
			.examSolution(examProblemSubmissionInfo.getExamSolution())
			.build();
	}
}
