package com.eum.lecture_service.event.event.notification;

import java.util.List;

import com.eum.lecture_service.command.entity.homework.Homework;
import com.eum.lecture_service.command.entity.lecture.Lecture;

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
	private List<Long> studentIds;

	public static HomeworkCreatedNotificationEvent of(Homework homework, List<Long> studentIds) {
		return HomeworkCreatedNotificationEvent.builder()
			.homeworkId(homework.getHomeworkId())
			.title(homework.getTitle())
			.studentIds(studentIds)
			.build();
	}
}
