package com.eum.notification_service.event.event;

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
public class ExamCreatedEvent {

	private Long examId;
	private String title;
	private Long lectureId;
	private List<Long> studentIds;
}
