package com.eum.lecture_service.query.service.homework;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.eum.lecture_service.config.exception.ErrorCode;
import com.eum.lecture_service.config.exception.EumException;
import com.eum.lecture_service.query.document.StudentOverviewModel;
import com.eum.lecture_service.query.document.studentInfo.HomeworkSubmissionInfo;
import com.eum.lecture_service.query.dto.homework.HomeworkProblemSubmissionInfoResponse;
import com.eum.lecture_service.query.dto.homework.HomeworkSubmissionInfoResponse;
import com.eum.lecture_service.query.repository.StudentOverviewRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HomeworkSubmissionQueryServiceImpl implements HomeworkSubmissionQueryService {

	private final StudentOverviewRepository studentOverviewRepository;

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
}
