package com.eum.lecture_service.event.handler.exam;

import java.util.ArrayList;
import java.util.List;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.eum.lecture_service.config.exception.ErrorCode;
import com.eum.lecture_service.config.exception.EumException;
import com.eum.lecture_service.event.dto.ExamProblemSubmissionEventDto;
import com.eum.lecture_service.event.event.exam.ExamSubmissionCreateEvent;
import com.eum.lecture_service.query.document.StudentOverviewModel;
import com.eum.lecture_service.query.document.TeacherOverviewModel;
import com.eum.lecture_service.query.document.studentInfo.ExamProblemSubmissionInfo;
import com.eum.lecture_service.query.document.studentInfo.ExamSubmissionInfo;
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
public class ExamSubmissionEventListener {

	private final StudentOverviewRepository studentOverviewRepository;
	private final TeacherOverviewRepository teacherOverviewRepository;

	@KafkaListener(topics = "exam-submission-event", groupId = "exam-group", properties = {
		"spring.json.value.default.type=com.eum.lecture_service.event.event.exam.ExamSubmissionCreateEvent"
	})
	public void handleExamSubmissionCreatedEvent(ExamSubmissionCreateEvent event) {
		Long studentId = event.getStudentId();
		Long lectureId = event.getLectureId();

		StudentOverviewModel studentModel = studentOverviewRepository.findByStudentIdAndLectureId(studentId, lectureId)
			.orElseThrow(() -> new EumException(ErrorCode.STUDENT_NOT_FOUND));

		ExamSubmissionInfo examSubmissionInfo = createExamSubmissionInfo(event);

		if (studentModel.getExamSubmissionInfo() == null) {
			studentModel.setExamSubmissionInfo(new ArrayList<>());
		}
		studentModel.getExamSubmissionInfo().add(examSubmissionInfo);

		updateStudentScores(studentModel);
		updateStudentOverview(studentModel);

		studentOverviewRepository.save(studentModel);

		updateTeacherOverviewModel(studentId, lectureId);
	}

	private ExamSubmissionInfo createExamSubmissionInfo(ExamSubmissionCreateEvent event) {
		List<ExamProblemSubmissionInfo> examProblemSubmissionInfos = new ArrayList<>();
		for (ExamProblemSubmissionEventDto dto : event.getProblemSubmissions()) {
			ExamProblemSubmissionInfo problemInfo = createExamProblemSubmissionInfo(dto);
			examProblemSubmissionInfos.add(problemInfo);
		}

		return new ExamSubmissionInfo(
			event.getExamSubmissionId(),
			event.getExamId(),
			event.getScore(),
			event.getCorrectCount(),
			event.getTotalCount(),
			event.getIsCompleted(),
			examProblemSubmissionInfos
		);
	}

	private ExamProblemSubmissionInfo createExamProblemSubmissionInfo(ExamProblemSubmissionEventDto dto) {
		return new ExamProblemSubmissionInfo(
			dto.getExamProblemSubmissionId(),
			dto.getQuestionId(),
			dto.getIsCorrect(),
			dto.getExamSolution()
		);
	}

	private void updateStudentOverview(StudentOverviewModel studentModel) {
		Overview overview = studentModel.getOverview();
		if (overview == null) {
			overview = new Overview();
			studentModel.setOverview(overview);
		}
		List<ExamSubmissionInfo> examSubmissionInfo = studentModel.getExamSubmissionInfo();
		overview.setExamCount((long)examSubmissionInfo.size());
	}

	private void updateStudentScores(StudentOverviewModel studentModel) {
		List<ExamSubmissionInfo> submissions = studentModel.getExamSubmissionInfo();

		int count = 0;
		double totalScore = 0;
		//우선 반복문을 돌면서 해당 이 제출된거면, 제출된것만 카운트해서 평균을 구합니다.
		for(ExamSubmissionInfo examSubmissionInfo : submissions) {
			if(examSubmissionInfo.getIsCompleted()) {
				count++;
				totalScore += examSubmissionInfo.getScore();
			}
		}
		double avgScore = count > 0 ? totalScore / count : 0.0;

		StudentScores scores = studentModel.getStudentScores();
		if (scores == null) {
			scores = new StudentScores();
			studentModel.setStudentScores(scores);
		}
		scores.setExamAvgScore(avgScore);
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

		int homeworkCount = 0;
		int examCount = 0;
		int attitudeCount = 0;

		for (StudentInfo studentInfo : studentInfos) {
			StudentScores scores = studentInfo.getStudentScores();
			if (scores != null) {
				if (scores.getHomeworkAvgScore() != null) {
					totalHomework += scores.getHomeworkAvgScore();
					homeworkCount++;
				}
				if (scores.getExamAvgScore() != null) {
					totalExam += scores.getExamAvgScore();
					examCount++;
				}
				if (scores.getAttitudeAvgScore() != null) {
					totalAttitude += scores.getAttitudeAvgScore();
					attitudeCount++;
				}
			}
		}

		double averageHomework = homeworkCount > 0 ? totalHomework / homeworkCount : 0.0;
		double averageExam = examCount > 0 ? totalExam / examCount : 0.0;
		double averageAttitude = attitudeCount > 0 ? totalAttitude / attitudeCount : 100.0;

		ClassAverageScores classAverageScores = new ClassAverageScores(
			averageHomework,
			averageExam,
			averageAttitude
		);

		teacherOverview.setClassAverageScores(classAverageScores);
	}

	private String generateTeacherOverviewId(Long lectureId) {
		return "teacher-overview-" + lectureId;
	}
}
