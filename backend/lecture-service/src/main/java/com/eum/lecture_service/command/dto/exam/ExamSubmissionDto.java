package com.eum.lecture_service.command.dto.exam;

import java.util.List;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExamSubmissionDto {

	private Long examSubmissionId;
	private Long examId;
	private Long studentId;
	private Double score;
	private Long correctCount;
	private Long totalCount;
	private boolean isCompleted;
	private List<ExamProblemSubmissionDto> problemSubmissions;

}
