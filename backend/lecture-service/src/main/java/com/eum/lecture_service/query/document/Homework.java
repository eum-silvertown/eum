package com.eum.lecture_service.query.document;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Homework {

	private Long homeworkId;
	private String title;
	private LocalDateTime startTime;
	private LocalDateTime endTime;
	private boolean isCompleted;
	private Long problemCount;
}
