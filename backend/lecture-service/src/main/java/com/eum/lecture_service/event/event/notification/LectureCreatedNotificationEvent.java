package com.eum.lecture_service.event.event.notification;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LectureCreatedNotificationEvent {

	private Long lectureId;
	private String title;
	private List<Long> studentIds;
}
