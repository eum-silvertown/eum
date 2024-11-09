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
	import com.eum.lecture_service.query.document.eventModel.StudentModel;
	import com.eum.lecture_service.query.document.studentInfo.HomeworkProblemSubmissionInfo;
	import com.eum.lecture_service.query.document.studentInfo.HomeworkSubmissionInfo;
	import com.eum.lecture_service.query.document.studentInfo.Overview;
	import com.eum.lecture_service.query.document.studentInfo.StudentScores;
	import com.eum.lecture_service.query.document.teacherInfo.ClassAverageScores;
	import com.eum.lecture_service.query.document.teacherInfo.StudentInfo;
	import com.eum.lecture_service.query.repository.StudentOverviewRepository;
	import com.eum.lecture_service.query.repository.StudentReadRepository;
	import com.eum.lecture_service.query.repository.TeacherOverviewRepository;

	import lombok.RequiredArgsConstructor;

	@Service
	@RequiredArgsConstructor
	public class HomeworkSubmissionEventListener {

		private final StudentOverviewRepository studentOverviewRepository;
		private final TeacherOverviewRepository teacherOverviewRepository;

		@KafkaListener(topics = "homework-submission-events",  groupId = "lecture-group")
		public void handleHomeworkSubmissionCreatedEvent(HomeworkSubmissionCreateEvent event) {
			Long studentId = event.getStudentId();
			Long lectureId = event.getLectureId();

			StudentOverviewModel studentModel = studentOverviewRepository.findByStudentIdAndLectureId(studentId, lectureId)
				.orElseThrow(() -> new EumException(ErrorCode.STUDENT_NOT_FOUND));;

			HomeworkSubmissionInfo submissionInfo = HomeworkSubmissionInfo.builder()
				.homeworkSubmissionId(event.getHomeworkSubmissionId())
				.homeworkId(event.getHomeworkId())
				.score(event.getScore())
				.correctCount(event.getCorrectCount())
				.totalCount(event.getTotalCount())
				.build();

			List<HomeworkProblemSubmissionInfo> problemSubmissionInfos = new ArrayList<>();
			for(HomeworkProblemSubmissionEventDto dto : event.getProblemSubmissions()) {
				HomeworkProblemSubmissionInfo problemInfo = HomeworkProblemSubmissionInfo.builder()
					.homeworkProblemSubmissionId(dto.getHomeworkProblemSubmissionId())
					.questionId(dto.getQuestionId())
					.isCorrect(dto.getIsCorrect())
					.homeworkSolution(dto.getHomeworkSolution())
					.build();
				problemSubmissionInfos.add(problemInfo);
			}
			submissionInfo.setProblemSubmissions(problemSubmissionInfos);

			if (studentModel.getHomeworkSubmissionInfo() == null) {
				studentModel.setHomeworkSubmissionInfo(new ArrayList<>());
			}
			studentModel.getHomeworkSubmissionInfo().add(submissionInfo);

			//학생 성적 업뎃
			updateStudentScores(studentModel);

			//학생 오버뷰 업뎃
			updateStudentOverview(studentModel);

			studentOverviewRepository.save(studentModel);

			//선생정보의 학생 성적 업뎃
			updateTeacherOverviewModel(studentId, lectureId);
		}

		private void updateStudentOverview(StudentOverviewModel studentModel) {
			Overview overview = studentModel.getOverview();
			if (overview == null) {
				overview = new Overview();
				studentModel.setOverview(overview);
			}

			long totalSolvedProblems = 0;
			List<HomeworkSubmissionInfo> submissions = studentModel.getHomeworkSubmissionInfo();

			for (HomeworkSubmissionInfo submission : submissions) {
				List<HomeworkProblemSubmissionInfo> problemSubmissions = submission.getProblemSubmissions();
				for (HomeworkProblemSubmissionInfo problemSubmission : problemSubmissions) {
					if (problemSubmission.getIsCorrect()) {
						totalSolvedProblems++;
					}
				}
			}
			overview.setHomeworkCount(totalSolvedProblems);
		}

		private void updateStudentScores(StudentOverviewModel studentModel) {
			List<HomeworkSubmissionInfo> submissions = studentModel.getHomeworkSubmissionInfo();
			double totalScore = submissions.stream()
				.mapToDouble(HomeworkSubmissionInfo::getScore)
				.sum();
			int submissionCount = submissions.size();
			double avgScore = totalScore / submissionCount;

			StudentScores scores = studentModel.getStudentScores();
			if (scores == null) {
				scores = new StudentScores();
				studentModel.setStudentScores(scores);
			}
			scores.setHomeworkAvgScore(avgScore);
		}

		private void updateTeacherOverviewModel(Long studentId, Long lectureId) {
			// TeacherOverviewModel 가져오기
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

			ClassAverageScores classAverageScores = ClassAverageScores.builder()
				.homeworkAvgScore(count > 0 ? totalHomework / count : 0.0)
				.examAvgScore(count > 0 ? totalExam / count : 0.0)
				.attitudeAvgScore(count > 0 ? totalAttitude / count : 100.0)
				.build();

			teacherOverview.setClassAverageScores(classAverageScores);
		}

		private String generateTeacherOverviewId(Long lectureId) {
			return "teacher-overview-" + lectureId;
		}

	}
