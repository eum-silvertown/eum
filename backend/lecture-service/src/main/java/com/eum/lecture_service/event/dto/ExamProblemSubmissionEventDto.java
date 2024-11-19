package com.eum.lecture_service.event.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamProblemSubmissionEventDto {

	private Long examProblemSubmissionId;
	private Long questionId;
	private Boolean isCorrect;
	private String examSolution;
}
