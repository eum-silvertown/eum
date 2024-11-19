package com.eum.lecture_service.event.event.notification;

import java.util.List;

import com.eum.lecture_service.command.entity.lecture.Lecture;
import com.eum.lecture_service.common.NotificationType;

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
	private String subject;
	private List<Long> studentIds;
	private String type;

	public static LectureCreatedNotificationEvent of(Lecture lecture, List<Long> studentIds) {
		return LectureCreatedNotificationEvent.builder()
			.lectureId(lecture.getLectureId())
			.title(lecture.getTitle())
			.subject(lecture.getSubject())
			.type(NotificationType.LECTURE_CREATION.getDescription())
			.studentIds(studentIds)
			.build();
	}
}
