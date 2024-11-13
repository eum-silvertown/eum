package com.eum.lecture_service.event.handler.member;

import java.util.List;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.eum.lecture_service.config.exception.ErrorCode;
import com.eum.lecture_service.config.exception.EumException;
import com.eum.lecture_service.event.event.member.ClassEvent;
import com.eum.lecture_service.event.event.member.StudentInfoEvent;
import com.eum.lecture_service.event.event.member.TeacherInfoEvent;
import com.eum.lecture_service.query.document.LectureModel;
import com.eum.lecture_service.query.document.StudentOverviewModel;
import com.eum.lecture_service.query.document.TeacherOverviewModel;
import com.eum.lecture_service.query.document.eventModel.ClassModel;
import com.eum.lecture_service.query.document.eventModel.StudentModel;
import com.eum.lecture_service.query.document.eventModel.TeacherModel;
import com.eum.lecture_service.query.document.studentInfo.Overview;
import com.eum.lecture_service.query.document.studentInfo.StudentScores;
import com.eum.lecture_service.query.document.teacherInfo.StudentInfo;
import com.eum.lecture_service.query.repository.ClassReadRepository;
import com.eum.lecture_service.query.repository.LectureReadRepository;
import com.eum.lecture_service.query.repository.StudentOverviewRepository;
import com.eum.lecture_service.query.repository.StudentReadRepository;
import com.eum.lecture_service.query.repository.TeacherOverviewRepository;
import com.eum.lecture_service.query.repository.TeacherReadRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class MemberEventListener {

	private final TeacherReadRepository teacherReadRepository;
	private final ClassReadRepository classReadRepository;
	private final StudentReadRepository studentReadRepository;
	private final LectureReadRepository lectureReadRepository;
	private final TeacherOverviewRepository teacherOverviewRepository;
	private final StudentOverviewRepository studentOverviewRepository;

	@KafkaListener(topics = "create_teacher", groupId = "member-group", properties = {
		"spring.json.value.default.type=com.eum.lecture_service.event.event.member.TeacherInfoEvent"
	})
	public void createTeacher(TeacherInfoEvent event) {
		TeacherModel teacher = TeacherModel.builder()
			.teacherId(event.getTeacherId())
			.name(event.getName())
			.email(event.getEmail())
			.tel(event.getTel())
			.image("https://d101-eum-bucket.s3.ap-northeast-2.amazonaws.com/image/default.svg")
			.build();

		teacherReadRepository.save(teacher);
	}

	@KafkaListener(topics = "update_teacher", groupId = "member-group", properties = {
		"spring.json.value.default.type=com.eum.lecture_service.event.event.member.TeacherInfoEvent"
	})
	public void updateTeacher(TeacherInfoEvent event) {
		teacherReadRepository.findById(event.getTeacherId()).ifPresentOrElse(
			teacher -> {
				teacher.setName(event.getName());
				teacher.setEmail(event.getEmail());
				teacher.setTel(event.getTel());
				teacher.setImage(event.getImage());

				teacherReadRepository.save(teacher);
			},
			() -> log.error("선생님 ID 찾을 수 없어서 업뎃 불가", event.getTeacherId())
		);
	}

	@KafkaListener(topics = "create_class", groupId = "member-group", properties = {
		"spring.json.value.default.type=com.eum.lecture_service.event.event.member.ClassEvent"
	})
	public void createClass(ClassEvent event) {
		ClassModel classModel = ClassModel.builder()
			.classId(event.getClassId())
			.grade(event.getGrade())
			.classNumber(event.getClassNumber())
			.school(event.getSchool())
			.build();

		classReadRepository.save(classModel);
	}

	@KafkaListener(topics = "create_student", groupId = "member-group", properties = {
		"spring.json.value.default.type=com.eum.lecture_service.event.event.member.StudentInfoEvent"
	})
	public void createStudent(StudentInfoEvent event) {
		StudentModel student = StudentModel.builder()
			.studentId(event.getStudentId())
			.name(event.getName())
			.image("https://d101-eum-bucket.s3.ap-northeast-2.amazonaws.com/image/default.svg")
			.classId(event.getClassId())
			.grade(event.getGrade())
			.classNumber(event.getClassNumber())
			.build();

		studentReadRepository.save(student);

		List<LectureModel> lectures = lectureReadRepository.findByClassId(event.getClassId());

		if (lectures.isEmpty()) {
			log.warn("Class ID {}에 속한 강의가 없습니다. 학생을 강의에 추가하지 않습니다.", event.getClassId());
		} else {
			for (LectureModel lecture : lectures) {
				TeacherOverviewModel teacherOverview = teacherOverviewRepository.findByLectureId(lecture.getLectureId())
					.orElseThrow(() -> new EumException(ErrorCode.TEACHERMODEL_NOT_FOUND));
				if (teacherOverview != null) {
					StudentInfo studentInfo = StudentInfo.builder()
						.studentId(student.getStudentId())
						.studentImage(student.getImage())
						.studentName(student.getName())
						.studentScores(new StudentScores(0.0, 0.0, 100.0))
						.build();

					teacherOverview.getStudents().add(studentInfo);
					teacherOverviewRepository.save(teacherOverview);

					String studentOverviewId = generateStudentOverviewId(studentInfo.getStudentId(), lecture.getLectureId());
					StudentOverviewModel studentOverview = StudentOverviewModel.builder()
						.id(studentOverviewId)
						.studentId(studentInfo.getStudentId())
						.lectureId(lecture.getLectureId())
						.overview(new Overview())
						.studentScores(new StudentScores(0.0, 0.0, 100.0))
						.build();

					studentOverviewRepository.save(studentOverview);
				} else {
					log.warn("Lecture ID {}에 대한 TeacherOverviewModel을 찾을 수 없습니다.", lecture.getLectureId());
				}
			}
		}
	}

	@KafkaListener(topics = "update_student", groupId = "member-group", properties = {
		"spring.json.value.default.type=com.eum.lecture_service.event.event.member.StudentInfoEvent"
	})
	public void updateStudent(StudentInfoEvent event) {
		studentReadRepository.findById(event.getStudentId()).ifPresentOrElse(
			student -> {
				student.setName(event.getName());
				student.setImage(event.getImage());
				student.setClassId(event.getClassId());
				student.setGrade(event.getGrade());
				student.setClassNumber(event.getClassNumber());

				studentReadRepository.save(student);
			},
			() -> log.error("학생 아이디 찾을 수 없어서 업뎃 불가", event.getStudentId())
		);
	}

	private String generateStudentOverviewId(Long studentId, Long lectureId) {
		return "student-overview-" + studentId + "-" + lectureId;
	}
}
