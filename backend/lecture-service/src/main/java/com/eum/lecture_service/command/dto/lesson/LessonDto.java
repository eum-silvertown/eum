package com.eum.lecture_service.command.dto.lesson;

import java.util.ArrayList;
import java.util.List;

import com.eum.lecture_service.command.entity.lecture.Lecture;
import com.eum.lecture_service.command.entity.lesson.Lesson;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonDto {

	private Long lessonId;
	private Long lectureId;
	private String title;
	private List<Long> questionIds;

	public Lesson toLessonEntity(Lecture lecture) {
		return Lesson.builder()
			.lecture(lecture)
			.title(title)
			.lessonQuestions(new ArrayList<>())
			.build();
	}
}
