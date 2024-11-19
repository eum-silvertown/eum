package com.eum.lecture_service.event.event.exam;

import java.time.LocalDateTime;
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
public class ExamCreateEvent {

	private Long examId;
	private Long lectureId;
	private String title;
	private LocalDateTime startTime;
	private LocalDateTime endTime;
	private List<Long> questionIds;
}
