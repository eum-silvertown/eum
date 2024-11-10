package com.eum.lecture_service.event.event.exam;

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
public class ExamDeleteEvent {

	private Long examId;
	private Long lectureId;
}
