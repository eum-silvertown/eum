package com.eum.lecture_service.command.service.lesson;

import java.util.List;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.eum.lecture_service.command.dto.lesson.LessonDto;
import com.eum.lecture_service.command.entity.exam.Exam;
import com.eum.lecture_service.command.entity.homework.HomeworkQuestion;
import com.eum.lecture_service.command.entity.lecture.Lecture;
import com.eum.lecture_service.command.entity.lesson.Lesson;
import com.eum.lecture_service.command.entity.lesson.LessonQuestion;
import com.eum.lecture_service.command.repository.lecture.LectureRepository;
import com.eum.lecture_service.command.repository.lesson.LessonRepository;
import com.eum.lecture_service.config.exception.ErrorCode;
import com.eum.lecture_service.config.exception.EumException;
import com.eum.lecture_service.event.event.exam.ExamCreateEvent;
import com.eum.lecture_service.event.event.lesson.LessonCreateEvent;
import com.eum.lecture_service.event.event.lesson.LessonDeleteEvent;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LessonServiceImpl implements LessonService {

	private final LectureRepository lectureRepository;
	private final LessonRepository lessonRepository;
	private final KafkaTemplate<String, Object> kafkaTemplate;

	@Override
	@Transactional
	public Long createLesson(LessonDto lessonDto) {
		Lecture lecture = lectureRepository.findById(lessonDto.getLectureId())
			.orElseThrow(() -> new EumException(ErrorCode.LECTURE_NOT_FOUND));

		List<Lesson> lessons = lecture.getLessons();
		for(Lesson lesson : lessons) {
			if(lesson.getTitle().equals(lessonDto.getTitle())) {
				throw new EumException(ErrorCode.LESSON_TITLE_DUPLICATE);
			}
		}

		Lesson lesson = lessonDto.toLessonEntity(lecture);
		Lesson savedLesson = lessonRepository.save(lesson);

		for (Long questionId : lessonDto.getQuestionIds()) {
			LessonQuestion lessonQuestion = LessonQuestion.builder()
				.lesson(savedLesson)
				.questionId(questionId)
				.build();
			savedLesson.getLessonQuestions().add(lessonQuestion);
		}

		publishLessonCreateEvent(savedLesson, lessonDto.getQuestionIds());

		return savedLesson.getLessonId();
	}


	@Override
	@Transactional
	public Long updateLesson(Long lessonId, LessonDto lessonDto) {
		Lesson lesson = lessonRepository.findById(lessonId)
			.orElseThrow(() -> new EumException(ErrorCode.LECTURE_NOT_FOUND));

		List<Lesson> lessons = lesson.getLecture().getLessons();
		for(Lesson findLesson : lessons) {
			if(findLesson.getTitle().equals(lessonDto.getTitle())) {
				throw new EumException(ErrorCode.LESSON_TITLE_DUPLICATE);
			}
		}

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
	@Transactional
	public void deleteLesson(Long lessonId) {
		Lesson lesson = lessonRepository.findById(lessonId)
			.orElseThrow(() -> new EumException(ErrorCode.LECTURE_NOT_FOUND));

		publishLessonDeleteEvent(lesson);

		lessonRepository.delete(lesson);
	}

	private void publishLessonDeleteEvent(Lesson lesson) {
		LessonDeleteEvent event = new LessonDeleteEvent(
			lesson.getLecture().getLectureId(),
			lesson.getLessonId()
		);
		kafkaTemplate.send("lesson-delete-event", event);
	}

	private void publishLessonCreateEvent(Lesson savedLesson, List<Long> lessonQuestions) {
		LessonCreateEvent event = new LessonCreateEvent(
			savedLesson.getLessonId(),
			savedLesson.getLecture().getLectureId(),
			savedLesson.getTitle(),
			lessonQuestions
		);
		kafkaTemplate.send("lesson-create-event", event);
	}
}
