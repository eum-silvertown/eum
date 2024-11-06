package com.eum.lecture_service.command.dto.homework;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HomeworkSubmissionDto {

	private Long homeworkSubmissionId;
	private Long homeworkId;
	private Long studentId;
	private Double score;
	private Long correctCount;
	private Long totalCount;
	private boolean isCompleted;
	private List<HomeworkProblemSubmissionDto> problemSubmissions;
}
