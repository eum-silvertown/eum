package com.eum.lecture_service.event.handler.exam;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.eum.lecture_service.config.exception.ErrorCode;
import com.eum.lecture_service.config.exception.EumException;
import com.eum.lecture_service.event.event.exam.ExamCreateEvent;
import com.eum.lecture_service.event.event.exam.ExamDeleteEvent;
import com.eum.lecture_service.event.event.exam.ExamUpdateEvent;
import com.eum.lecture_service.query.document.LectureModel;
import com.eum.lecture_service.query.document.lectureInfo.ExamInfo;
import com.eum.lecture_service.query.repository.LectureReadRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExamEventListener {

	private final LectureReadRepository lectureReadRepository;

	@KafkaListener(topics = "exam-create-topic", groupId = "exam-group", properties = {
		"spring.json.value.default.type=com.eum.lecture_service.event.event.exam.ExamCreateEvent"
	})
	public void handleExamCreate(ExamCreateEvent event) {
		LectureModel lecture = lectureReadRepository.findById(event.getLectureId())
			.orElseThrow(() -> new EumException(ErrorCode.LECTURE_NOT_FOUND));

		ExamInfo examInfo = createExamInfo(event);
		lecture.getExams().add(examInfo);
		lectureReadRepository.save(lecture);
	}

	@KafkaListener(topics = "exam-update-topic", groupId = "exam-group", properties = {
		"spring.json.value.default.type=com.eum.lecture_service.event.event.exam.ExamUpdateEvent"
	})
	public void handleExamUpdated(ExamUpdateEvent event) {
		LectureModel lecture = lectureReadRepository.findById(event.getLectureId())
			.orElseThrow(() -> new EumException(ErrorCode.LECTURE_NOT_FOUND));

		lecture.getExams().removeIf(hw -> hw.getExamId().equals(event.getExamId()));

		ExamInfo examInfo = updateExamInfo(event);
		lecture.getExams().add(examInfo);
		lectureReadRepository.save(lecture);
	}

	@KafkaListener(topics = "exam-delete-topic", groupId = "exam-group", properties = {
		"spring.json.value.default.type=com.eum.lecture_service.event.event.exam.ExamDeleteEvent"
	})
	public void handleExamDeleted(ExamDeleteEvent event) {
		LectureModel lecture = lectureReadRepository.findById(event.getLectureId())
			.orElseThrow(() -> new EumException(ErrorCode.LECTURE_NOT_FOUND));

		lecture.getExams().removeIf(hw -> hw.getExamId().equals(event.getExamId()));
		lectureReadRepository.save(lecture);
	}

	private ExamInfo createExamInfo(ExamCreateEvent event) {
		return new ExamInfo(
			event.getExamId(),
			event.getTitle(),
			event.getStartTime(),
			event.getEndTime(),
			event.getQuestionIds()
		);
	}

	private ExamInfo updateExamInfo(ExamUpdateEvent event) {
		return new ExamInfo(
			event.getExamId(),
			event.getTitle(),
			event.getStartTime(),
			event.getEndTime(),
			event.getQuestionIds()
		);
	}
}
