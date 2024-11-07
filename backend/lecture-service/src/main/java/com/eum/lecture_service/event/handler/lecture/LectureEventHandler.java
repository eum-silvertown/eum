package com.eum.lecture_service.event.handler.lecture;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.eum.lecture_service.event.event.lecture.LectureCreatedEvent;
import com.eum.lecture_service.event.event.lecture.LectureDeletedEvent;
import com.eum.lecture_service.event.event.lecture.LectureUpdatedEvent;
import com.eum.lecture_service.query.document.LectureModel;
import com.eum.lecture_service.query.document.TeacherOverviewModel;
import com.eum.lecture_service.query.document.teacherInfo.StudentInfo;
import com.eum.lecture_service.query.document.lectureInfo.ScheduleInfo;
import com.eum.lecture_service.query.repository.LectureReadRepository;
import com.eum.lecture_service.query.repository.StudentOverviewRepository;
import com.eum.lecture_service.query.repository.StudentReadRepository;
import com.eum.lecture_service.query.repository.TeacherOverviewRepository;
import com.eum.lecture_service.query.repository.TeacherReadRepository;
import com.eum.lecture_service.query.document.eventModel.StudentModel;
import com.eum.lecture_service.query.document.StudentOverviewModel;
import com.eum.lecture_service.query.document.studentInfo.StudentScores;
import com.eum.lecture_service.query.document.teacherInfo.ClassAverageScores;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class LectureEventHandler {

	private final LectureReadRepository lectureReadRepository;
	private final StudentReadRepository studentReadRepository;
	private final TeacherOverviewRepository teacherOverviewReadRepository;
	private final StudentOverviewRepository studentOverviewReadRepository;

	// 강의 생성 이벤트 처리
	@KafkaListener(topics = "lecture-created-topic", groupId = "lecture-group")
	public void handleLectureCreated(LectureCreatedEvent event) {
		// 강의 기본 정보 설정
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
			log.warn("Class ID {}에 속한 학생이 없습니다. TeacherOverviewModel에 학생 정보를 저장하지 않습니다.", event.getClassId());
		} else {
			List<StudentInfo> studentInfos = students.stream()
				.map(student -> StudentInfo.builder()
					.studentId(student.getStudentId())
					.studentImage(student.getImage())
					.studentName(student.getName())
					.studentScores(null)
					.build())
				.collect(Collectors.toList());

			Long teacherId = event.getTeacherId();
			Long classId = event.getClassId();
			String teacherOverviewId = generateTeacherOverviewId(teacherId, classId);

			TeacherOverviewModel teacherOverview = TeacherOverviewModel.builder()
				.id(teacherOverviewId)
				.teacherId(teacherId)
				.classId(classId)
				.students(studentInfos)
				.classAverageScores(null) // 회원가입 시 초기값 설정
				.build();

			teacherOverviewReadRepository.save(teacherOverview);

			studentInfos.forEach(studentInfo -> {
				String studentOverviewId = generateStudentOverviewId(studentInfo.getStudentId(), classId);
				StudentOverviewModel studentOverview = StudentOverviewModel.builder()
					.id(studentOverviewId)
					.studentId(studentInfo.getStudentId())
					.classId(classId)
					.overview(null)
					.studentScores(null)
					.build();

				studentOverviewReadRepository.save(studentOverview);
			});
		}
		lectureReadRepository.save(lecture);
	}

	@KafkaListener(topics = "lecture-updated-topic", groupId = "lecture-group")
	public void handleLectureUpdated(LectureUpdatedEvent event) {
		lectureReadRepository.findById(event.getLectureId()).ifPresentOrElse(
			lecture -> {
				updateLectureModel(lecture, event);

				String teacherOverviewId = generateTeacherOverviewId(event.getTeacherId(), event.getClassId());

				TeacherOverviewModel teacherOverview = teacherOverviewReadRepository.findById(teacherOverviewId)
					.orElse(createNewTeacherOverview(event.getTeacherId(), event.getClassId()));

				List<StudentInfo> studentInfos = updateStudentInfos(event.getClassId());
				teacherOverview.setStudents(studentInfos);

				teacherOverview.setClassAverageScores(calculateClassAverageScores(studentScoresList(studentInfos)));

				teacherOverviewReadRepository.save(teacherOverview);

				updateStudentOverviews(studentInfos, event.getClassId());

				lectureReadRepository.save(lecture);
			},
			() -> log.error("강의를 찾을 수 없습니다.", event.getLectureId())
		);
	}

	// LectureModel 업데이트 로직
	private void updateLectureModel(LectureModel lecture, LectureUpdatedEvent event) {
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
	}

	private TeacherOverviewModel createNewTeacherOverview(Long teacherId, Long classId) {
		return TeacherOverviewModel.builder()
			.id(generateTeacherOverviewId(teacherId, classId))
			.teacherId(teacherId)
			.classId(classId)
			.students(List.of())
			.classAverageScores(null)
			.build();
	}

	// StudentInfos 생성 및 업데이트
	private List<StudentInfo> updateStudentInfos(Long classId) {
		List<StudentModel> students = studentReadRepository.findByClassId(classId);
		return students.stream()
			.map(student -> {
				StudentOverviewModel studentOverview = studentOverviewReadRepository
					.findByStudentIdAndClassId(student.getStudentId(), classId)
					.orElse(null);
				StudentScores studentScores = studentOverview != null ? studentOverview.getStudentScores() : null;

				return StudentInfo.builder()
					.studentId(student.getStudentId())
					.studentImage(student.getImage())
					.studentName(student.getName())
					.studentScores(studentScores) // 개별 학생의 성적 정보 포함
					.build();
			})
			.collect(Collectors.toList());
	}

	private void updateStudentOverviews(List<StudentInfo> studentInfos, Long classId) {
		studentInfos.forEach(studentInfo -> {
			String studentOverviewId = generateStudentOverviewId(studentInfo.getStudentId(), classId);
			StudentOverviewModel studentOverview = studentOverviewReadRepository.findById(studentOverviewId)
				.orElse(StudentOverviewModel.builder()
					.id(studentOverviewId)
					.studentId(studentInfo.getStudentId())
					.classId(classId)
					.overview(null)
					.studentScores(studentInfo.getStudentScores())
					.build());

			studentOverviewReadRepository.save(studentOverview);
		});
	}

	// 강의 삭제 이벤트 처리
	@KafkaListener(topics = "lecture-deleted-topic", groupId = "lecture-group")
	public void handleLectureDeleted(LectureDeletedEvent event) {
		lectureReadRepository.findById(event.getLectureId()).ifPresentOrElse(
			lecture -> {
				Long teacherId = lecture.getTeacherId();
				Long classId = lecture.getClassId();
				String teacherOverviewId = generateTeacherOverviewId(teacherId, classId);

				lectureReadRepository.deleteById(event.getLectureId());

				teacherOverviewReadRepository.findById(teacherOverviewId).ifPresent(existingTeacherOverview -> {
					teacherOverviewReadRepository.deleteById(existingTeacherOverview.getId());
				});

				List<StudentOverviewModel> studentOverviews = studentOverviewReadRepository.findByClassId(classId);
				studentOverviews.forEach(studentOverview -> {
					String studentOverviewId = generateStudentOverviewId(studentOverview.getStudentId(), classId);
					studentOverviewReadRepository.deleteById(studentOverviewId);
				});
			},
			() -> log.error("강의를 찾을 수 없습니다.", event.getLectureId())
		);
	}

	// 수업 전체 평균 성적 계산 메서드
	private ClassAverageScores calculateClassAverageScores(List<StudentScores> studentScoresList) {
		double totalHomework = 0.0;
		double totalTest = 0.0;
		double totalAttitude = 0.0;
		int count = studentScoresList.size();

		for (StudentScores scores : studentScoresList) {
			totalHomework += scores.getHomeworkAvgScore() != null ? scores.getHomeworkAvgScore() : 0.0;
			totalTest += scores.getTestAvgScore() != null ? scores.getTestAvgScore() : 0.0;
			totalAttitude += scores.getAttitudeAvgScore() != null ? scores.getAttitudeAvgScore() : 0.0;
		}

		return ClassAverageScores.builder()
			.homeworkAvgScore(count > 0 ? totalHomework / count : 0.0)
			.testAvgScore(count > 0 ? totalTest / count : 0.0)
			.attitudeAvgScore(count > 0 ? totalAttitude / count : 0.0)
			.build();
	}

	private List<StudentScores> studentScoresList(List<StudentInfo> studentInfos) {
		return studentInfos.stream()
			.map(StudentInfo::getStudentScores)
			.filter(scores -> scores != null)
			.collect(Collectors.toList());
	}

	private String generateTeacherOverviewId(Long teacherId, Long classId) {
		return teacherId + "-" + classId;
	}

	private String generateStudentOverviewId(Long studentId, Long classId) {
		return studentId + "-" + classId;
	}
}
