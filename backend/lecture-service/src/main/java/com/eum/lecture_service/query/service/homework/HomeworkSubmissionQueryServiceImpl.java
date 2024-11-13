package com.eum.lecture_service.query.service.homework;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.eum.lecture_service.command.entity.lecture.Lecture;
import com.eum.lecture_service.config.exception.ErrorCode;
import com.eum.lecture_service.config.exception.EumException;
import com.eum.lecture_service.query.document.LectureModel;
import com.eum.lecture_service.query.document.StudentOverviewModel;
import com.eum.lecture_service.query.document.eventModel.StudentModel;
import com.eum.lecture_service.query.document.lectureInfo.HomeworkInfo;
import com.eum.lecture_service.query.document.studentInfo.HomeworkSubmissionInfo;
import com.eum.lecture_service.query.dto.homework.HomeworkProblemSubmissionInfoResponse;
import com.eum.lecture_service.query.dto.homework.HomeworkSubmissionInfoResponse;
import com.eum.lecture_service.query.dto.homework.StudentHomeworkResponse;
import com.eum.lecture_service.query.repository.LectureReadRepository;
import com.eum.lecture_service.query.repository.StudentOverviewRepository;
import com.eum.lecture_service.query.repository.StudentReadRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HomeworkSubmissionQueryServiceImpl implements HomeworkSubmissionQueryService {

	private final StudentOverviewRepository studentOverviewRepository;
	private final StudentReadRepository studentReadRepository;
	private final LectureReadRepository lectureReadRepository;

	//특정 숙제에 대한 학생들 성적 모두 조회
	@Override
	public List<HomeworkSubmissionInfoResponse> getHomeworkSubmissions(Long lectureId, Long homeworkId) {
		List<StudentOverviewModel> studentOverviews = studentOverviewRepository.findByLectureId(lectureId);

		return studentOverviews.stream()
			.flatMap(student -> student.getHomeworkSubmissionInfo().stream())
			.filter(submission -> submission.getHomeworkId().equals(homeworkId))
			.map(HomeworkSubmissionInfoResponse::fromHomeworkSubmission)
			.collect(Collectors.toList());
	}

	// 특정 학생의 숙제 제출 내역 조회
	@Override
	public HomeworkSubmissionInfoResponse getStudentHomeworkSubmission(Long lectureId, Long homeworkId, Long studentId) {
		StudentOverviewModel studentOverview = studentOverviewRepository
			.findByStudentIdAndLectureId(studentId, lectureId)
			.orElseThrow(() -> new EumException(ErrorCode.STUDENT_NOT_FOUND));

		HomeworkSubmissionInfo submissionInfo = studentOverview.getHomeworkSubmissionInfo().stream()
			.filter(submission -> submission.getHomeworkId().equals(homeworkId))
			.findFirst()
			.orElseThrow(() -> new EumException(ErrorCode.HOMEWORK_SUBMISSION_NOT_FOUND));

		return HomeworkSubmissionInfoResponse.fromHomeworkSubmission(submissionInfo);
	}

	@Override
	public HomeworkProblemSubmissionInfoResponse getHomeworkProblemSubmission(Long lectureId, Long homeworkId, Long studentId,
		Long problemId) {
		HomeworkSubmissionInfoResponse submissionResponse = getStudentHomeworkSubmission(
			lectureId, homeworkId, studentId);

		return submissionResponse.getProblemSubmissions().stream()
			.filter(problem -> problem.getQuestionId().equals(problemId))
			.findFirst()
			.orElseThrow(() -> new EumException(ErrorCode.HOMEWORK_PROBLEM_SUBMISSION_NOT_FOUND));
	}

	@Override
	public List<HomeworkSubmissionInfoResponse> getAllHomeworkSubmissionsByStudent(Long lectureId, Long studentId) {
		StudentOverviewModel studentOverview = studentOverviewRepository
			.findByStudentIdAndLectureId(studentId, lectureId)
			.orElseThrow(() -> new EumException(ErrorCode.STUDENT_NOT_FOUND));

		return studentOverview.getHomeworkSubmissionInfo().stream()
			.map(HomeworkSubmissionInfoResponse::fromHomeworkSubmission)
			.collect(Collectors.toList());
	}

	@Override
	public StudentHomeworkResponse getStudentAllLectureHomeworkOverview(Long studentId) {
		StudentModel student = studentReadRepository.findById(studentId)
			.orElseThrow(() -> new EumException(ErrorCode.STUDENT_NOT_FOUND));

		Long classId = student.getClassId();

		List<LectureModel> lectures = lectureReadRepository.findByClassId(classId);

		List<StudentOverviewModel> studentOverviews = studentOverviewRepository.findByStudentId(studentId);

		Map<Long, StudentOverviewModel> overviewMap = studentOverviews.stream()
			.collect(Collectors.toMap(StudentOverviewModel::getLectureId, Function.identity()));

		List<StudentHomeworkResponse.StudentHomeworkInfo> homeworkDetails = new ArrayList<>();
		Long totalHomeworkCount = 0L;
		Long completedHomeworkCount = 0L;
		Double totalScore = 0.0;

		for (LectureModel lecture : lectures) {
			List<HomeworkInfo> homeworks = lecture.getHomeworks();
			for (HomeworkInfo homework : homeworks) {
				totalHomeworkCount++;

				StudentOverviewModel overview = overviewMap.get(lecture.getLectureId());
				HomeworkSubmissionInfo submission = null;
				if (overview != null) {
					submission = overview.getHomeworkSubmissionInfo().stream()
						.filter(hs -> hs.getHomeworkId().equals(homework.getHomeworkId()))
						.findFirst()
						.orElse(null);
				}

				if (submission != null && submission.getIsComplete()) {
					completedHomeworkCount++;
					totalScore += submission.getScore() != null ? submission.getScore() : 0.0;

					homeworkDetails.add(StudentHomeworkResponse.StudentHomeworkInfo.builder()
						.homeworkId(homework.getHomeworkId())
						.title(homework.getTitle())
						.subject(lecture.getSubject())
						.startTime(homework.getStartTime())
						.endTime(homework.getEndTime())
						.score(submission.getScore())
						.correctCount(submission.getCorrectCount())
						.totalCount(submission.getTotalCount())
						.isComplete(true)
						.build());
				} else {
					homeworkDetails.add(StudentHomeworkResponse.StudentHomeworkInfo.builder()
						.homeworkId(homework.getHomeworkId())
						.title(homework.getTitle())
						.subject(lecture.getSubject())
						.startTime(homework.getStartTime())
						.endTime(homework.getEndTime())
						.score(null)
						.correctCount(null)
						.totalCount(null)
						.isComplete(false)
						.build());
				}
			}
		}

		Double averageScore = completedHomeworkCount > 0 ? totalScore / completedHomeworkCount : 0.0;

		return StudentHomeworkResponse.builder()
			.totalHomeworkCount(totalHomeworkCount)
			.completedHomeworkCount(completedHomeworkCount)
			.averageScore(averageScore)
			.homeworkDetails(homeworkDetails)
			.build();
	}

}
