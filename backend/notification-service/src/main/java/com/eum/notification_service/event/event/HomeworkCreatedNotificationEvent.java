package com.eum.notification_service.event.event;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HomeworkCreatedNotificationEvent {

	private Long homeworkId;
	private String title;
	private String subject;
	private List<Long> studentIds;
	private String type;

}
