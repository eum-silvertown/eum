package com.eum.lecture_service.command.service.lesson;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.eum.lecture_service.command.dto.lesson.LessonDto;
import com.eum.lecture_service.command.entity.homework.HomeworkQuestion;
import com.eum.lecture_service.command.entity.lecture.Lecture;
import com.eum.lecture_service.command.entity.lesson.Lesson;
import com.eum.lecture_service.command.entity.lesson.LessonQuestion;
import com.eum.lecture_service.command.repository.lecture.LectureRepository;
import com.eum.lecture_service.command.repository.lesson.LessonRepository;
import com.eum.lecture_service.config.exception.ErrorCode;
import com.eum.lecture_service.config.exception.EumException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LessonServiceImpl implements LessonService {

	private final LectureRepository lectureRepository;
	private final LessonRepository lessonRepository;

	@Override
	@Transactional
	public Long createLesson(LessonDto lessonDto) {
		Lecture lecture = lectureRepository.findById(lessonDto.getLectureId())
			.orElseThrow(() -> new EumException(ErrorCode.LECTURE_NOT_FOUND));

		Lesson lesson = lessonDto.toLessonEntity(lecture);
		Lesson savedLesson = lessonRepository.save(lesson);

		for (Long questionId : lessonDto.getQuestionIds()) {
			LessonQuestion lessonQuestion = LessonQuestion.builder()
				.lesson(savedLesson)
				.questionId(questionId)
				.build();
			savedLesson.getLessonQuestions().add(lessonQuestion);
		}

		return savedLesson.getLessonId();
	}

	@Override
	@Transactional
	public Long updateLesson(Long lessonId, LessonDto lessonDto) {
		Lesson lesson = lessonRepository.findById(lessonId)
			.orElseThrow(() -> new EumException(ErrorCode.LECTURE_NOT_FOUND));

		if(lessonDto.getTitle() != null) {
			lesson.setTitle(lessonDto.getTitle());
		}

		if(lessonDto.getQuestionIds() != null) {
			lesson.getLessonQuestions().clear();

			for (Long questionId : lessonDto.getQuestionIds()) {
				LessonQuestion lessonQuestion = LessonQuestion.builder()
					.lesson(lesson)
					.questionId(questionId)
					.build();
				lesson.getLessonQuestions().add(lessonQuestion);
			}
		}

		Lesson savedLesson = lessonRepository.save(lesson);
		return savedLesson.getLessonId();
	}

	@Override
	public void deleteLesson(Long lessonId) {
		Lesson lesson = lessonRepository.findById(lessonId)
			.orElseThrow(() -> new EumException(ErrorCode.LECTURE_NOT_FOUND));

		lessonRepository.delete(lesson);
	}
}
