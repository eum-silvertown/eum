package com.eum.lecture_service.command.dto.exam;

import com.eum.lecture_service.command.entity.exam.ExamProblemSubmission;
import com.eum.lecture_service.command.entity.exam.ExamSubmission;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExamProblemSubmissionDto {

	private Long examProblemSubmissionId;
	private Long examSubmissionId;
	private Long questionId;
	private Long studentId;
	private Boolean isCorrect;
	private String examSolution;

	public ExamProblemSubmission toEntity(ExamSubmission examSubmission, Long studentId) {
		return ExamProblemSubmission.builder()
			.examSubmission(examSubmission)
			.questionId(questionId)
			.studentId(studentId)
			.isCorrect(isCorrect)
			.examSolution(examSolution)
			.build();
	}
}
