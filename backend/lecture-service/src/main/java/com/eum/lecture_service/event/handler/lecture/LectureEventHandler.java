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
import com.eum.lecture_service.query.document.studentInfo.Overview;
import com.eum.lecture_service.query.document.teacherInfo.StudentInfo;
import com.eum.lecture_service.query.document.lectureInfo.ScheduleInfo;
import com.eum.lecture_service.query.repository.ClassReadRepository;
import com.eum.lecture_service.query.repository.LectureReadRepository;
import com.eum.lecture_service.query.repository.StudentOverviewRepository;
import com.eum.lecture_service.query.repository.StudentReadRepository;
import com.eum.lecture_service.query.repository.TeacherOverviewRepository;
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
	private final TeacherOverviewRepository teacherOverviewRepository;
	private final StudentOverviewRepository studentOverviewRepository;
	private final ClassReadRepository classReadRepository;

	// 강의 생성 이벤트 처리
	@KafkaListener(topics = "lecture-created-topic", groupId = "lecture-group")
	public void handleLectureCreated(LectureCreatedEvent event) {
		// 강의 기본 정보 설정
		LectureModel lecture = LectureModel.builder()
			.lectureId(event.getLectureId())
			.title(event.getTitle())
			.subject(event.getSubject())
			.introduction(event.getIntroduction())
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

		List<StudentModel> students = studentReadRepository.findByClassId(event.getClassId());

		if (students.isEmpty()) {
			log.warn("Class ID {}에 속한 학생이 없습니다. TeacherOverviewModel에 학생 정보를 저장하지 않습니다.", event.getClassId());
		} else {
			List<StudentInfo> studentInfos = students.stream()
				.map(student -> StudentInfo.builder()
					.studentId(student.getStudentId())
					.studentImage(student.getImage())
					.studentName(student.getName())
					.studentScores(new StudentScores(0.0, 0.0, 100.0)) // 기본값 설정
					.build())
				.collect(Collectors.toList());

			Long teacherId = event.getTeacherId();
			Long lectureId = event.getLectureId(); // lectureId 사용
			String teacherOverviewId = generateTeacherOverviewId(lectureId);

			TeacherOverviewModel teacherOverview = TeacherOverviewModel.builder()
				.id(teacherOverviewId)
				.teacherId(teacherId)
				.lectureId(lectureId)
				.students(studentInfos)
				.classAverageScores(new ClassAverageScores(0.0, 0.0, 100.0))
				.build();

			teacherOverviewRepository.save(teacherOverview);

			studentInfos.forEach(studentInfo -> {
				String studentOverviewId = generateStudentOverviewId(studentInfo.getStudentId(), lectureId);
				StudentOverviewModel studentOverview = StudentOverviewModel.builder()
					.id(studentOverviewId)
					.studentId(studentInfo.getStudentId())
					.lectureId(lectureId)
					.overview(new Overview())
					.studentScores(new StudentScores(0.0, 0.0, 100.0))
					.build();

				studentOverviewRepository.save(studentOverview);
			});
		}
	}

	@KafkaListener(topics = "lecture-updated-topic", groupId = "lecture-group")
	public void handleLectureUpdated(LectureUpdatedEvent event) {
		lectureReadRepository.findById(event.getLectureId()).ifPresentOrElse(
			lecture -> {
				updateLectureModel(lecture, event);

				//원래 이 수업의 학생 수
				Long originalStudentSize = (long)studentOverviewRepository.findByLectureId(
					lecture.getLectureId()).size();

				//현재 이 학급의 학생 수
				List<StudentModel> studentSize = studentReadRepository.findByClassId(lecture.getClassId());

				if (originalStudentSize != studentSize.size()) {
					Long lectureId = event.getLectureId();
					List<StudentInfo> studentInfos = updateStudentInfos(lectureId);
					String teacherOverviewId = generateTeacherOverviewId(lectureId);

					TeacherOverviewModel teacherOverview = teacherOverviewRepository.findById(teacherOverviewId)
						.orElse(createNewTeacherOverview(event.getTeacherId(), lectureId));

					teacherOverview.setStudents(studentInfos);

					ClassAverageScores classAverageScores = calculateClassAverageScores(studentScoresList(studentInfos));
					teacherOverview.setClassAverageScores(classAverageScores);

					teacherOverviewRepository.save(teacherOverview);

					updateStudentOverviews(studentInfos, lectureId);
				}

				lectureReadRepository.save(lecture);
			},
			() -> log.error("강의를 찾을 수 없습니다. Lecture ID: {}", event.getLectureId())
		);
	}

	// LectureModel 업데이트 로직
	private void updateLectureModel(LectureModel lecture, LectureUpdatedEvent event) {
		lecture.setTitle(event.getTitle());
		lecture.setSubject(event.getSubject());
		lecture.setIntroduction(event.getIntroduction());
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

	private TeacherOverviewModel createNewTeacherOverview(Long teacherId, Long lectureId) {
		return TeacherOverviewModel.builder()
			.id(generateTeacherOverviewId(lectureId))
			.teacherId(teacherId)
			.lectureId(lectureId)
			.students(List.of())
			.classAverageScores(new ClassAverageScores(0.0, 0.0, 100.0))
			.build();
	}

	private List<StudentInfo> updateStudentInfos(Long lectureId) {
		LectureModel lecture = lectureReadRepository.findById(lectureId)
			.orElseThrow(() -> new IllegalArgumentException("강의를 찾을 수 없습니다. Lecture ID: " + lectureId));

		List<StudentModel> students = studentReadRepository.findByClassId(lecture.getClassId());

		return students.stream()
			.map(student -> {
				StudentOverviewModel studentOverview = studentOverviewRepository
					.findByStudentIdAndLectureId(student.getStudentId(), lectureId)
					.orElse(null);
				StudentScores studentScores = studentOverview != null ? studentOverview.getStudentScores() : new StudentScores(0.0, 0.0, 100.0);

				return StudentInfo.builder()
					.studentId(student.getStudentId())
					.studentImage(student.getImage())
					.studentName(student.getName())
					.studentScores(studentScores)
					.build();
			})
			.collect(Collectors.toList());
	}

	private void updateStudentOverviews(List<StudentInfo> studentInfos, Long lectureId) {
		studentInfos.forEach(studentInfo -> {
			String studentOverviewId = generateStudentOverviewId(studentInfo.getStudentId(), lectureId);
			StudentOverviewModel studentOverview = studentOverviewRepository.findById(studentOverviewId)
				.orElse(StudentOverviewModel.builder()
					.id(studentOverviewId)
					.studentId(studentInfo.getStudentId())
					.lectureId(lectureId)
					.overview(new Overview())
					.studentScores(studentInfo.getStudentScores())
					.build());

			studentOverviewRepository.save(studentOverview);
		});
	}

	// 강의 삭제 이벤트 처리
	@KafkaListener(topics = "lecture-deleted-topic", groupId = "lecture-group")
	public void handleLectureDeleted(LectureDeletedEvent event) {
		lectureReadRepository.findById(event.getLectureId()).ifPresentOrElse(
			lecture -> {
				Long lectureId = lecture.getLectureId();
				String teacherOverviewId = generateTeacherOverviewId(lectureId);

				lectureReadRepository.deleteById(event.getLectureId());

				teacherOverviewRepository.findById(teacherOverviewId).ifPresent(existingTeacherOverview -> {
					teacherOverviewRepository.deleteById(existingTeacherOverview.getId());
				});

				List<StudentOverviewModel> studentOverviews = studentOverviewRepository.findByLectureId(lectureId);
				studentOverviews.forEach(studentOverview -> {
					String studentOverviewId = generateStudentOverviewId(studentOverview.getStudentId(), lectureId);
					studentOverviewRepository.deleteById(studentOverviewId);
				});
			},
			() -> log.error("강의를 찾을 수 없습니다. Lecture ID: {}", event.getLectureId())
		);
	}

	private ClassAverageScores calculateClassAverageScores(List<StudentScores> studentScoresList) {
		double totalHomework = 0.0;
		double totalExam = 0.0;
		double totalAttitude = 0.0;
		int count = studentScoresList.size();

		for (StudentScores scores : studentScoresList) {
			totalHomework += scores.getHomeworkAvgScore() != null ? scores.getHomeworkAvgScore() : 0.0;
			totalExam += scores.getExamAvgScore() != null ? scores.getExamAvgScore() : 0.0;
			totalAttitude += scores.getAttitudeAvgScore() != null ? scores.getAttitudeAvgScore() : 100.0;
		}

		return ClassAverageScores.builder()
			.homeworkAvgScore(count > 0 ? totalHomework / count : 0.0)
			.examAvgScore(count > 0 ? totalExam / count : 0.0)
			.attitudeAvgScore(count > 0 ? totalAttitude / count : 100.0)
			.build();
	}

	private List<StudentScores> studentScoresList(List<StudentInfo> studentInfos) {
		return studentInfos.stream()
			.map(StudentInfo::getStudentScores)
			.filter(scores -> scores != null)
			.collect(Collectors.toList());
	}

	private String generateTeacherOverviewId(Long lectureId) {
		return "teacher-overview-" + lectureId;
	}

	private String generateStudentOverviewId(Long studentId, Long lectureId) {
		return "student-overview-" + studentId + "-" + lectureId;
	}
}
