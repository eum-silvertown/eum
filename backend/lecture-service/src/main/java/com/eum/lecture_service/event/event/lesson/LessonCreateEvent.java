package com.eum.lecture_service.event.event.lesson;

import java.time.LocalDateTime;
import java.util.List;

import com.eum.lecture_service.command.dto.lesson.LessonDto;
import com.eum.lecture_service.command.entity.lecture.Notice;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LessonCreateEvent {

	private Long lessonId;
	private Long lectureId;
	private String title;
	private List<Long> questionIds;

	public LessonCreateEvent(LessonDto dto) {
		this.lessonId = dto.getLessonId();
		this.lectureId = dto.getLectureId();
		this.title = dto.getTitle();
		this.questionIds = dto.getQuestionIds();
	}
}
