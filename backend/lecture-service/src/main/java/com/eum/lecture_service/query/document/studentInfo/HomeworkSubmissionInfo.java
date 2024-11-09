package com.eum.lecture_service.query.document.studentInfo;

import java.util.List;

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
public class HomeworkSubmissionInfo {

	private Long homeworkSubmissionId;
	private Long homeworkId;
	private Double score;
	private Long correctCount;
	private Long totalCount;
	private List<HomeworkProblemSubmissionInfo> problemSubmissions;
}
