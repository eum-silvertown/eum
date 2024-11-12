package com.eum.lecture_service.event.event.notification;

import java.util.List;

import com.eum.lecture_service.command.entity.exam.Exam;
import com.eum.lecture_service.command.entity.homework.Homework;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamCreatedNotificationEvent {

	private Long examId;
	private String title;
	private List<Long> studentIds;

	public static ExamCreatedNotificationEvent of(Exam exam, List<Long> studentIds) {
		return ExamCreatedNotificationEvent.builder()
			.examId(exam.getExamId())
			.title(exam.getTitle())
			.studentIds(studentIds)
			.build();
	}
}
