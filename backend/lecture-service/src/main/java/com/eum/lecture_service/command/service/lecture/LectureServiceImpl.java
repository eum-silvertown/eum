package com.eum.lecture_service.command.service.lecture;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.eum.lecture_service.command.dto.lecture.LectureCreateDto;
import com.eum.lecture_service.command.dto.lecture.LectureDto;
import com.eum.lecture_service.command.entity.lecture.Lecture;
import com.eum.lecture_service.command.entity.lecture.LectureSchedule;
import com.eum.lecture_service.command.repository.lecture.LectureRepository;
import com.eum.lecture_service.command.repository.lecture.LectureScheduleRepository;
import com.eum.lecture_service.config.exception.ErrorCode;
import com.eum.lecture_service.config.exception.EumException;
import com.eum.lecture_service.event.event.lecture.LectureCreatedEvent;
import com.eum.lecture_service.event.event.lecture.LectureDeletedEvent;
import com.eum.lecture_service.event.event.lecture.LectureStatusUpdatedEvent;
import com.eum.lecture_service.event.event.lecture.LectureUpdatedEvent;
import com.eum.lecture_service.event.event.notification.LectureCreatedNotificationEvent;
import com.eum.lecture_service.event.event.notification.LectureStartedNotificationEvent;
import com.eum.lecture_service.query.document.eventModel.ClassModel;
import com.eum.lecture_service.query.document.eventModel.StudentModel;
import com.eum.lecture_service.query.repository.ClassReadRepository;
import com.eum.lecture_service.query.repository.StudentReadRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LectureServiceImpl implements LectureService{

	private final LectureRepository lectureRepository;
	private final LectureScheduleRepository lectureScheduleRepository;
	private final KafkaTemplate<String, Object> kafkaTemplate;
	private final ClassReadRepository classReadRepository;
	private final StudentReadRepository studentReadRepository;

	@Override
	@Transactional
	public Long createLecture(LectureCreateDto lectureDto, Long teacherId) {

		ClassModel classModel = classReadRepository.findByAndSchoolAndGradeAndAndClassNumber(
			lectureDto.getSchool(), lectureDto.getGrade(), lectureDto.getClassNumber())
			.orElseThrow(() -> new EumException(ErrorCode.CLASS_NOT_FOUND));

		Lecture lecture = lectureDto.toLectureEntity(teacherId, classModel.getClassId());

		lectureRepository.save(lecture);

		List<LectureSchedule> schedules = lectureDto.toLectureScheduleEntities(lecture);

		validateLectureSchedule(schedules, lecture.getClassId());

		lecture.setLectureSchedules(schedules);

		Lecture savedLecture = lectureRepository.save(lecture);

		//이벤트 발행
		LectureCreatedEvent event = new LectureCreatedEvent(savedLecture);
		kafkaTemplate.send("lecture-created-topic", event);

		//알림 이벤트 발생
		publishCreateNotificationEvent(savedLecture);

		return savedLecture.getLectureId();
	}


	private void validateLectureSchedule(List<LectureSchedule> schedules, Long classId) {
		for (LectureSchedule schedule : schedules) {
			List<LectureSchedule> existingSchedules = lectureScheduleRepository.findByLectureClassIdAndDayAndPeriod(
				classId, schedule.getDay(), schedule.getPeriod());

			if (!existingSchedules.isEmpty()) {
				throw new EumException(ErrorCode.SCHEDULE_CONFLICT);
			}
		}
	}


	@Override
	@Transactional
	public Long updateLecture(LectureDto lectureDto, Long lectureId) {
		Lecture lecture = lectureRepository.findById(lectureId)
			.orElseThrow(() -> new EumException(ErrorCode.LECTURE_NOT_FOUND));

		lecture.updateFromDTO(lectureDto);

		if (lectureDto.getSchedule() != null) {
			lecture.getLectureSchedules().clear();
			List<LectureSchedule> newSchedules = lectureDto.toLectureScheduleEntities(lecture);
			validateLectureSchedule(newSchedules, lecture.getClassId());
			lecture.getLectureSchedules().addAll(newSchedules);
		}

		Lecture savedLecture = lectureRepository.save(lecture);

		//이벤트 발생
		LectureUpdatedEvent event = new LectureUpdatedEvent(savedLecture);
		kafkaTemplate.send("lecture-updated-topic", event);

		return savedLecture.getLectureId();
	}

	@Override
	@Transactional
	public void deleteLecture(Long lectureId) {
		if (!lectureRepository.existsById(lectureId)) {
			throw new EumException(ErrorCode.LECTURE_NOT_FOUND);
		}
		lectureRepository.deleteById(lectureId);

		LectureDeletedEvent event = new LectureDeletedEvent(lectureId);
		kafkaTemplate.send("lecture-deleted-topic", event);
	}

	@Override
	public Optional<Lecture> getLecture(Long lectureId) {
		return lectureRepository.findById(lectureId);
	}

	@Override
	@Transactional
	public void switchLecture(Long lectureId, Long teacherId) {
		Lecture lecture = lectureRepository.findById(lectureId)
			.orElseThrow(() -> new EumException(ErrorCode.LECTURE_NOT_FOUND));

		if (!lecture.getTeacherId().equals(teacherId)) {
			throw new EumException(ErrorCode.AUTHORITY_PERMISSION_ERROR);
		}
		Boolean lectureStatus = lecture.getLectureStatus();
		lecture.setLectureStatus(!lectureStatus);
		Lecture savedlecture = lectureRepository.save(lecture);

		LectureStatusUpdatedEvent event = new LectureStatusUpdatedEvent(lectureId, savedlecture.getLectureStatus());
		kafkaTemplate.send("lecture-status-updated-topic", event);

		//스위칭 알림이벤트 -> 만약 lecture 상태가 true면
		if(savedlecture.getLectureStatus()) {
			publishStartNotificationEvent(savedlecture);
		}
	}

	private List<Long> getStudentIds(Long classId) {
		List<StudentModel> studentModels = studentReadRepository.findByClassId(classId);

		return studentModels.stream()
			.map(StudentModel::getStudentId)
			.collect(Collectors.toList());
	}

	private void publishCreateNotificationEvent(Lecture savedLecture) {

		List<Long> studentIds = getStudentIds(savedLecture.getClassId());

		LectureCreatedNotificationEvent event = LectureCreatedNotificationEvent.of(savedLecture, studentIds);

		kafkaTemplate.send("lecture-created-notification-topic", event);
	}

	private void publishStartNotificationEvent(Lecture savedLecture) {
		List<Long> studentIds = getStudentIds(savedLecture.getClassId());

		LectureStartedNotificationEvent event = LectureStartedNotificationEvent.of(savedLecture, studentIds);

		kafkaTemplate.send("lecture-started-notification-topic", event);
	}
}
