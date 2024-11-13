package com.eum.lecture_service.event.handler.homework;

import java.util.ArrayList;
import java.util.List;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.eum.lecture_service.config.exception.ErrorCode;
import com.eum.lecture_service.config.exception.EumException;
import com.eum.lecture_service.event.dto.HomeworkProblemSubmissionEventDto;
import com.eum.lecture_service.event.event.homework.HomeworkSubmissionCreateEvent;
import com.eum.lecture_service.query.document.StudentOverviewModel;
import com.eum.lecture_service.query.document.TeacherOverviewModel;
import com.eum.lecture_service.query.document.studentInfo.ExamSubmissionInfo;
import com.eum.lecture_service.query.document.studentInfo.HomeworkProblemSubmissionInfo;
import com.eum.lecture_service.query.document.studentInfo.HomeworkSubmissionInfo;
import com.eum.lecture_service.query.document.studentInfo.Overview;
import com.eum.lecture_service.query.document.studentInfo.StudentScores;
import com.eum.lecture_service.query.document.teacherInfo.ClassAverageScores;
import com.eum.lecture_service.query.document.teacherInfo.StudentInfo;
import com.eum.lecture_service.query.repository.StudentOverviewRepository;
import com.eum.lecture_service.query.repository.TeacherOverviewRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class HomeworkSubmissionEventListener {

	private final StudentOverviewRepository studentOverviewRepository;
	private final TeacherOverviewRepository teacherOverviewRepository;

	@KafkaListener(topics = "homework-submission-event", groupId = "homework-group", properties = {
		"spring.json.value.default.type=com.eum.lecture_service.event.event.homework.HomeworkSubmissionCreateEvent"
	})
	public void handleHomeworkSubmissionCreatedEvent(HomeworkSubmissionCreateEvent event) {
		Long studentId = event.getStudentId();
		Long lectureId = event.getLectureId();
		System.out.println("들어오나?");

		StudentOverviewModel studentModel = studentOverviewRepository.findByStudentIdAndLectureId(studentId, lectureId)
			.orElseThrow(() -> new EumException(ErrorCode.STUDENT_NOT_FOUND));

		HomeworkSubmissionInfo homeworkSubmissionInfo = createHomeworkSubmissionInfo(event);

		if (studentModel.getHomeworkSubmissionInfo() == null) {
			studentModel.setHomeworkSubmissionInfo(new ArrayList<>());
		}
		studentModel.getHomeworkSubmissionInfo().add(homeworkSubmissionInfo);

		updateStudentScores(studentModel);
		updateStudentOverview(studentModel);

		studentOverviewRepository.save(studentModel);

		updateTeacherOverviewModel(studentId, lectureId);
	}

	private HomeworkSubmissionInfo createHomeworkSubmissionInfo(HomeworkSubmissionCreateEvent event) {
		List<HomeworkProblemSubmissionInfo> problemSubmissionInfos = new ArrayList<>();
		for (HomeworkProblemSubmissionEventDto dto : event.getProblemSubmissions()) {
			HomeworkProblemSubmissionInfo problemInfo = createHomeworkProblemSubmissionInfo(dto);
			problemSubmissionInfos.add(problemInfo);
		}

		return new HomeworkSubmissionInfo(
			event.getHomeworkSubmissionId(),
			event.getHomeworkId(),
			event.getScore(),
			event.getCorrectCount(),
			event.getTotalCount(),
			event.getIsComplete(),
			problemSubmissionInfos
		);
	}

	private HomeworkProblemSubmissionInfo createHomeworkProblemSubmissionInfo(HomeworkProblemSubmissionEventDto dto) {
		return new HomeworkProblemSubmissionInfo(
			dto.getHomeworkProblemSubmissionId(),
			dto.getQuestionId(),
			dto.getIsCorrect(),
			dto.getHomeworkSolution()
		);
	}

	private void updateStudentOverview(StudentOverviewModel studentModel) {
		Overview overview = studentModel.getOverview();
		if (overview == null) {
			overview = new Overview();
			studentModel.setOverview(overview);
		}

		List<HomeworkSubmissionInfo> submissions = studentModel.getHomeworkSubmissionInfo();

		overview.setHomeworkCount((long)submissions.size());
	}

	private void updateStudentScores(StudentOverviewModel studentModel) {
		List<HomeworkSubmissionInfo> submissions = studentModel.getHomeworkSubmissionInfo();
		double totalScore = submissions.stream()
			.mapToDouble(HomeworkSubmissionInfo::getScore)
			.sum();
		int submissionCount = submissions.size();
		double avgScore = submissionCount > 0 ? totalScore / submissionCount : 0.0;

		StudentScores scores = studentModel.getStudentScores();
		if (scores == null) {
			scores = new StudentScores();
			studentModel.setStudentScores(scores);
		}
		scores.setHomeworkAvgScore(avgScore);
	}

	private void updateTeacherOverviewModel(Long studentId, Long lectureId) {
		String teacherOverviewId = generateTeacherOverviewId(lectureId);
		TeacherOverviewModel teacherOverview = teacherOverviewRepository.findById(teacherOverviewId)
			.orElseThrow(() -> new EumException(ErrorCode.TEACHER_NOT_FOUND));

		List<StudentInfo> studentInfos = teacherOverview.getStudents();
		for (StudentInfo studentInfo : studentInfos) {
			if (studentInfo.getStudentId().equals(studentId)) {

				StudentOverviewModel studentOverview = studentOverviewRepository.findByStudentIdAndLectureId(studentId, lectureId)
					.orElseThrow(() -> new EumException(ErrorCode.STUDENT_NOT_FOUND));
				studentInfo.setStudentScores(studentOverview.getStudentScores());
				break;
			}
		}

		updateClassAverageScores(teacherOverview);

		teacherOverviewRepository.save(teacherOverview);
	}

	private void updateClassAverageScores(TeacherOverviewModel teacherOverview) {
		List<StudentInfo> studentInfos = teacherOverview.getStudents();
		double totalHomework = 0.0;
		double totalExam = 0.0;
		double totalAttitude = 0.0;
		int count = 0;

		for (StudentInfo studentInfo : studentInfos) {
			StudentScores scores = studentInfo.getStudentScores();
			if (scores != null) {
				totalHomework += scores.getHomeworkAvgScore() != null ? scores.getHomeworkAvgScore() : 0.0;
				totalExam += scores.getExamAvgScore() != null ? scores.getExamAvgScore() : 0.0;
				totalAttitude += scores.getAttitudeAvgScore() != null ? scores.getAttitudeAvgScore() : 100.0;
				count++;
			}
		}

		ClassAverageScores classAverageScores = new ClassAverageScores(
			count > 0 ? totalHomework / count : 0.0,
			count > 0 ? totalExam / count : 0.0,
			count > 0 ? totalAttitude / count : 100.0
		);

		teacherOverview.setClassAverageScores(classAverageScores);
	}

	private String generateTeacherOverviewId(Long lectureId) {
		return "teacher-overview-" + lectureId;
	}
}
