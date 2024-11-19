package com.eum.lecture_service.event.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HomeworkProblemSubmissionEventDto {

	private Long homeworkProblemSubmissionId;
	private Long questionId;
	private Boolean isCorrect;
	private String homeworkSolution;
}
