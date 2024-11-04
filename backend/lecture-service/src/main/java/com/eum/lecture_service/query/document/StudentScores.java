package com.eum.lecture_service.query.document;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentScores {

	private Long studentId;
	private Long homeworkScore;
	private Long testScore;
	private Long attitudeScore;
}
