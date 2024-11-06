package com.eum.lecture_service.command.dto.homework;

import com.eum.lecture_service.command.entity.homework.HomeworkProblemSubmission;
import com.eum.lecture_service.command.entity.homework.HomeworkSubmission;

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
public class HomeworkProblemSubmissionDto {

	private Long homeworkProblemSubmissionId;
	private Long homeworkSubmissionId;
	private Long questionId;
	private Long studentId;
	private Boolean isCorrect;

	public HomeworkProblemSubmission toEntity(HomeworkSubmission homeworkSubmission, Long studentId) {
		return HomeworkProblemSubmission.builder()
			.homeworkSubmission(homeworkSubmission)
			.questionId(questionId)
			.studentId(studentId)
			.isCorrect(isCorrect)
			.build();
	}
}
