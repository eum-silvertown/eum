package com.eum.lecture_service.event.handler.lecture;

import java.util.stream.Collectors;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.eum.lecture_service.event.event.lecture.LectureCreatedEvent;
import com.eum.lecture_service.event.event.lecture.LectureDeletedEvent;
import com.eum.lecture_service.event.event.lecture.LectureUpdatedEvent;
import com.eum.lecture_service.query.document.LectureModel;
import com.eum.lecture_service.query.document.info.ScheduleInfo;
import com.eum.lecture_service.query.repository.LectureReadRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class LectureEventHandler {

	private final LectureReadRepository lectureReadRepository;

	@KafkaListener(topics = "lecture-created-topic", groupId = "lecture-group")
	public void handleLectureCreated(LectureCreatedEvent event) {
		LectureModel lecture = LectureModel.builder()
			.lectureId(event.getLectureId())
			.title(event.getTitle())
			.subject(event.getSubject())
			.backgroundColor(event.getBackgroundColor())
			.fontColor(event.getFontColor())
			.year(event.getYear())
			.semester(event.getSemester())
			.teacherId(event.getTeacherId())
			.classId(event.getClassId())
			.schedule(event.getSchedule().stream()
				.map(s -> ScheduleInfo.builder()
					.day(s.getDay())
					.period(s.getPeriod())
					.build())
				.collect(Collectors.toList()))
			.build();
		lectureReadRepository.save(lecture);
	}

	@KafkaListener(topics = "lecture-updated-topic", groupId = "lecture-group")
	public void handleLectureUpdated(LectureUpdatedEvent event) {
		LectureModel lecture = lectureReadRepository.findById(event.getLectureId())
			.orElse(new LectureModel());

		lecture.setLectureId(event.getLectureId());
		lecture.setTitle(event.getTitle());
		lecture.setSubject(event.getSubject());
		lecture.setBackgroundColor(event.getBackgroundColor());
		lecture.setFontColor(event.getFontColor());
		lecture.setYear(event.getYear());
		lecture.setSemester(event.getSemester());
		lecture.setTeacherId(event.getTeacherId());
		lecture.setClassId(event.getClassId());
		lecture.setSchedule(event.getSchedule().stream()
			.map(s -> ScheduleInfo.builder()
				.day(s.getDay())
				.period(s.getPeriod())
				.build())
			.collect(Collectors.toList()));

		lectureReadRepository.save(lecture);
	}

	@KafkaListener(topics = "lecture-deleted-topic", groupId = "lecture-group")
	public void handleLectureDeleted(LectureDeletedEvent event) {
		lectureReadRepository.deleteById(event.getLectureId());
	}
}
