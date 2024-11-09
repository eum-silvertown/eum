package com.eum.lecture_service.event.handler.homework;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.eum.lecture_service.config.exception.ErrorCode;
import com.eum.lecture_service.config.exception.EumException;
import com.eum.lecture_service.event.event.homework.HomeworkCreateEvent;
import com.eum.lecture_service.event.event.homework.HomeworkDeleteEvent;
import com.eum.lecture_service.event.event.homework.HomeworkUpdateEvent;
import com.eum.lecture_service.query.document.LectureModel;
import com.eum.lecture_service.query.document.lectureInfo.HomeworkInfo;
import com.eum.lecture_service.query.repository.LectureReadRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HomeworkEventListener {

	private final LectureReadRepository lectureReadRepository;

	@KafkaListener(topics = "homework-create-topic", groupId = "homework-group")
	public void handleHomeworkCreate(HomeworkCreateEvent event) {
		LectureModel lecture = lectureReadRepository.findById(event.getLectureId())
			.orElseThrow(() -> new EumException(ErrorCode.LECTURE_NOT_FOUND));

		HomeworkInfo homeworkInfo = HomeworkInfo.builder()
			.homeworkId(event.getHomeworkId())
			.title(event.getTitle())
			.startTime(event.getStartTime())
			.endTime(event.getEndTime())
			.questions(event.getQuestionIds())
			.build();

		lecture.getHomeworks().add(homeworkInfo);
		lectureReadRepository.save(lecture);
	}

	@KafkaListener(topics = "homework-update-topic", groupId = "homework-group")
	public void handleHomeworkUpdated(HomeworkUpdateEvent event) {
		LectureModel lecture = lectureReadRepository.findById(event.getLectureId())
			.orElseThrow(() -> new EumException(ErrorCode.LECTURE_NOT_FOUND));

		lecture.getHomeworks().removeIf(hw -> hw.getHomeworkId().equals(event.getHomeworkId()));

		HomeworkInfo homeworkInfo = HomeworkInfo.builder()
			.homeworkId(event.getHomeworkId())
			.title(event.getTitle())
			.startTime(event.getStartTime())
			.endTime(event.getEndTime())
			.questions(event.getQuestionIds())
			.build();

		lecture.getHomeworks().add(homeworkInfo);
		lectureReadRepository.save(lecture);

	}

	@KafkaListener(topics = "homework-delete-topic", groupId = "homework-group")
	public void handleHomeworkDeleted(HomeworkDeleteEvent event) {
		LectureModel lecture = lectureReadRepository.findById(event.getLectureId())
			.orElseThrow(() -> new EumException(ErrorCode.LECTURE_NOT_FOUND));

		lecture.getHomeworks().removeIf(hw -> hw.getHomeworkId().equals(event.getHomeworkId()));
		lectureReadRepository.save(lecture);
	}
}
