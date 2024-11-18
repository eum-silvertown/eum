package com.eum.lecture_service.event.event.homework;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HomeworkDeleteEvent {

	private Long homeworkId;
	private Long lectureId;
}
