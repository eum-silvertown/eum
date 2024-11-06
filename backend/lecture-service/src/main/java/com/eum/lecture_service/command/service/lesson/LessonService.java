package com.eum.lecture_service.command.service.lesson;

import com.eum.lecture_service.command.dto.lesson.LessonDto;

public interface LessonService {
	Long createLesson(LessonDto lessonDto);

	Long updateLesson(Long lessonId, LessonDto lessonDto);

	void deleteLesson(Long lessonId);
}
