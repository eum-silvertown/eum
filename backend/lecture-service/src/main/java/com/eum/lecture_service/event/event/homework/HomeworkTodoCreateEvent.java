package com.eum.lecture_service.event.event.homework;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HomeworkTodoCreateEvent {

	private Long homeworkId;
	private Long lectureId;
	private String lectureTitle;
	private String subject;
	private String title;
	private String backgroundColor;
	private LocalDateTime startTime;
	private LocalDateTime endTime;
	private List<Long> studentIds;
}
