package com.eum.lecture_service.event.handler.lesson;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.eum.lecture_service.command.repository.lecture.LectureRepository;
import com.eum.lecture_service.config.exception.ErrorCode;
import com.eum.lecture_service.config.exception.EumException;
import com.eum.lecture_service.event.event.lesson.LessonCreateEvent;
import com.eum.lecture_service.event.event.lesson.LessonDeleteEvent;
import com.eum.lecture_service.event.event.notice.NoticeCreateEvent;
import com.eum.lecture_service.event.event.notice.NoticeDeletedEvent;
import com.eum.lecture_service.query.document.LectureModel;
import com.eum.lecture_service.query.document.lectureInfo.LessonInfo;
import com.eum.lecture_service.query.document.lectureInfo.NoticeInfo;
import com.eum.lecture_service.query.repository.LectureReadRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LessonEventListener {

	private final LectureReadRepository lectureReadRepository;

	@KafkaListener(topics = "lesson-create-topic", groupId = "lesson-group",  properties = {
		"spring.json.value.default.type=com.eum.lecture_service.event.event.lesson.LessonCreateEvent"
	})
	public void handleLessonCreate(LessonCreateEvent event) {
		LectureModel lecture = lectureReadRepository.findById(event.getLectureId())
			.orElseThrow(() -> new EumException(ErrorCode.LECTURE_NOT_FOUND));

		LessonInfo lesson = createLessonInfo(event);
		lecture.getLessons().add(lesson);
		lectureReadRepository.save(lecture);
	}

	@KafkaListener(topics = "lesson-delete-topic", groupId = "lesson-group",  properties = {
		"spring.json.value.default.type=com.eum.lecture_service.event.event.lesson.LessonDeleteEvent"
	})
	public void handleLessonDelete(LessonDeleteEvent event) {
		LectureModel lecture = lectureReadRepository.findById(event.getLectureId())
			.orElseThrow(() -> new EumException(ErrorCode.LECTURE_NOT_FOUND));

		lecture.getLessons().removeIf(lesson -> lesson.getLessonId().equals(event.getLessonId()));
		lectureReadRepository.save(lecture);
	}

	private LessonInfo createLessonInfo(LessonCreateEvent event) {
		return LessonInfo.builder()
			.lessonId(event.getLessonId())
			.title(event.getTitle())
			.questions(event.getQuestionIds())
			.build();
	}

}
