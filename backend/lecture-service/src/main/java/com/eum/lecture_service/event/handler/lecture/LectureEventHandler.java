package com.eum.lecture_service.event.handler.lecture;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.eum.lecture_service.event.event.lecture.LectureCreatedEvent;
import com.eum.lecture_service.event.event.lecture.LectureDeletedEvent;
import com.eum.lecture_service.event.event.lecture.LectureUpdatedEvent;
import com.eum.lecture_service.query.document.LectureModel;
import com.eum.lecture_service.query.document.StudentOverviewModel;
import com.eum.lecture_service.query.document.TeacherOverviewModel;
import com.eum.lecture_service.query.document.eventModel.StudentModel;
import com.eum.lecture_service.query.document.lectureInfo.ScheduleInfo;
import com.eum.lecture_service.query.document.teacherInfo.StudentInfo;
import com.eum.lecture_service.query.repository.LectureReadRepository;
import com.eum.lecture_service.query.repository.StudentOverviewRepository;
import com.eum.lecture_service.query.repository.StudentReadRepository;
import com.eum.lecture_service.query.repository.TeacherOverviewRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class LectureEventHandler {

	private final LectureReadRepository lectureReadRepository;
	private final StudentReadRepository studentReadRepository;
	private final TeacherOverviewRepository teacherOverviewRepository;
	private final StudentOverviewRepository studentOverviewRepository;

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

		List<StudentModel> students = studentReadRepository.findByClassId(event.getClassId());

		if (students.isEmpty()) {
			log.warn("Class ID {}에 속한 학생이 없습니다.", event.getClassId());
		} else {
			List<StudentInfo> studentInfos = students.stream()
				.map(student -> StudentInfo.builder()
					.studentId(student.getStudentId())
					.studentImage(student.getImage())
					.studentName(student.getName())
					.build())
				.collect(Collectors.toList());

			Long teacherId = event.getTeacherId();
			Long classId = event.getClassId();
			TeacherOverviewModel teacherOverview = teacherOverviewRepository.findByTeacherIdAndClassId(teacherId, classId)
				.orElse(TeacherOverviewModel.builder()
					.teacherId(teacherId)
					.classId(classId)
					.students(List.of())
					.classAverageScores(null)
					.build());

			teacherOverview.setStudents(studentInfos);

			teacherOverviewRepository.save(teacherOverview);

			studentInfos.forEach(studentInfo -> {
				StudentOverviewModel studentOverview = studentOverviewRepository.findByStudentIdAndClassId(studentInfo.getStudentId(), classId)
					.orElse(StudentOverviewModel.builder()
						.studentId(studentInfo.getStudentId())
						.classId(classId)
						.overview(null)
						.studentScores(null)
						.build());

				studentOverviewRepository.save(studentOverview);
			});
		}
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
