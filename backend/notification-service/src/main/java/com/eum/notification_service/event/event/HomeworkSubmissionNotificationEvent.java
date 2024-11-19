package com.eum.notification_service.event.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HomeworkSubmissionNotificationEvent {

	private Long homeworkId;
	private Long teacherId;
	private String subject;
	private String homeworkTitle;
	private String studentName;
	private String type;
	private Long grade;
	private Long classNumber;

}