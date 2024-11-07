package com.eum.lecture_service.event.handler.member;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.eum.lecture_service.event.event.member.ClassCreatedEvent;
import com.eum.lecture_service.event.event.member.StudentCreatedEvent;
import com.eum.lecture_service.event.event.member.StudentInfoUpdatedEvent;
import com.eum.lecture_service.event.event.member.TeacherCreatedEvent;
import com.eum.lecture_service.event.event.member.TeacherInfoUpdatedEvent;
import com.eum.lecture_service.query.document.eventModel.ClassModel;
import com.eum.lecture_service.query.document.eventModel.StudentModel;
import com.eum.lecture_service.query.document.eventModel.TeacherModel;
import com.eum.lecture_service.query.repository.ClassReadRepository;
import com.eum.lecture_service.query.repository.StudentReadRepository;
import com.eum.lecture_service.query.repository.TeacherReadRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class MemberEventHandler {

	private final TeacherReadRepository teacherReadRepository;
	private final ClassReadRepository classReadRepository;
	private final StudentReadRepository studentReadRepository;

	@KafkaListener(topics = "create_teacher", groupId = "lecture-group")
	public void createTeacher(TeacherCreatedEvent event) {
		TeacherModel teacher = TeacherModel.builder()
			.teacherId(event.getTeacherId())
			.name(event.getName())
			.email(event.getEmail())
			.tel(event.getTel())
			.image(event.getImage())
			.build();

		teacherReadRepository.save(teacher);
	}

	@KafkaListener(topics = "update_teacher", groupId = "lecture-group")
	public void updateTeacher(TeacherInfoUpdatedEvent event) {
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

	@KafkaListener(topics = "create_class", groupId = "lecture-group")
	public void createClass(ClassCreatedEvent event) {
		ClassModel classModel = ClassModel.builder()
			.classId(event.getClassId())
			.grade(event.getGrade())
			.classNumber(event.getClassNumber())
			.school(event.getSchool())
			.build();

		classReadRepository.save(classModel);
	}

	@KafkaListener(topics = "create_student", groupId = "lecture-group")
	public void createStudent(StudentCreatedEvent event) {
		StudentModel student = StudentModel.builder()
			.studentId(event.getStudentId())
			.name(event.getName())
			.image(event.getImage())
			.classId(event.getClassId())
			.grade(event.getGrade())
			.classNumber(event.getClassNumber())
			.build();

		studentReadRepository.save(student);
	}

	@KafkaListener(topics = "update_student", groupId = "lecture-group")
	public void updateStudent(StudentInfoUpdatedEvent event) {
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
}
