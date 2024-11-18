package com.eum.lecture_service.event.event.notification;

import java.util.List;

import com.eum.lecture_service.command.entity.lecture.Lecture;
import com.eum.lecture_service.common.NotificationType;

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
