package com.eum.lecture_service.query.dto.homework;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StudentHomeworkResponse {
	private Long totalHomeworkCount;
	private Long completedHomeworkCount;
	private Double averageScore;
	private List<StudentHomeworkInfo> homeworkDetails;

	@Data
	@Builder
	public static class StudentHomeworkInfo {
		private Long homeworkId;
		private String title;
		private String subject;
		private LocalDateTime startTime;
		private LocalDateTime endTime;
		private Double score;
		private Long correctCount;
		private Long totalCount;
		private Boolean isComplete;
	}
}