package com.eum.lecture_service.query.document.teacherInfo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassAverageScores {

	private Double homeworkAvgScore;
	private Double examAvgScore;
	private Double attitudeAvgScore;
}
