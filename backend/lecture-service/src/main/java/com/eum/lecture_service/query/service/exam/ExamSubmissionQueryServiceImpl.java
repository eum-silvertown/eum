package com.eum.lecture_service.query.service.exam;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.eum.lecture_service.config.exception.ErrorCode;
import com.eum.lecture_service.config.exception.EumException;
import com.eum.lecture_service.query.document.StudentOverviewModel;
import com.eum.lecture_service.query.document.eventModel.StudentModel;
import com.eum.lecture_service.query.document.studentInfo.ExamSubmissionInfo;
import com.eum.lecture_service.query.dto.exam.ExamProblemSubmissionInfoResponse;
import com.eum.lecture_service.query.dto.exam.ExamSubmissionInfoResponse;
import com.eum.lecture_service.query.dto.exam.ExamSubmissionsInfoResponse;
import com.eum.lecture_service.query.repository.StudentOverviewRepository;
import com.eum.lecture_service.query.repository.StudentReadRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExamSubmissionQueryServiceImpl implements ExamSubmissionQueryService {

	private final StudentOverviewRepository studentOverviewRepository;
	private final StudentReadRepository studentReadRepository;

	@Override
	public List<ExamSubmissionsInfoResponse> getExamSubmissions(Long lectureId, Long examId) {
		List<StudentOverviewModel> studentOverviews = studentOverviewRepository.findByLectureId(lectureId);

		List<ExamSubmissionsInfoResponse> examSubmissions = new ArrayList<>();
		studentOverviews.forEach(studentOverview -> {
			StudentModel student = studentReadRepository.findById(studentOverview.getStudentId())
				.orElseThrow(() -> new EumException(ErrorCode.STUDENT_NOT_FOUND));
			studentOverview.getExamSubmissionInfo().stream()
				.filter(examSubmissionInfo -> examSubmissionInfo.getExamId().equals(examId))
				.forEach(examSubmissionInfo ->
					examSubmissions.add(ExamSubmissionsInfoResponse.fromExamSubmission(examSubmissionInfo, student))
				);
		});

		return examSubmissions;
	}

	@Override
	public ExamSubmissionInfoResponse getStudentExamSubmission(Long lectureId, Long examId, Long studentId) {
		StudentOverviewModel studentOverview = studentOverviewRepository
			.findByStudentIdAndLectureId(studentId, lectureId)
			.orElseThrow(() -> new EumException(ErrorCode.STUDENT_NOT_FOUND));

		ExamSubmissionInfo submissionInfo = studentOverview.getExamSubmissionInfo().stream()
			.filter(submission -> submission.getExamId().equals(examId))
			.findFirst()
			.orElseThrow(() -> new EumException(ErrorCode.EXAM_NOT_FOUND));

		return ExamSubmissionInfoResponse.fromExamSubmission(submissionInfo);
	}

	@Override
	public ExamProblemSubmissionInfoResponse getExamProblemSubmission(Long lectureId, Long examId, Long studentId,
		Long problemId) {
		ExamSubmissionInfoResponse submissionInfoResponse = getStudentExamSubmission(
			lectureId, examId, studentId);

		return submissionInfoResponse.getProblemSubmissions().stream()
			.filter(problem -> problem.getQuestionId().equals(problemId))
			.findFirst()
			.orElseThrow(() -> new EumException(ErrorCode.EXAM_PROBLEM_SUBMISSION_NOT_FOUND));
	}

	@Override
	public List<ExamSubmissionInfoResponse> getAllExamSubmissionsByStudent(Long lectureId, Long studentId) {
		StudentOverviewModel studentOverview = studentOverviewRepository
			.findByStudentIdAndLectureId(studentId, lectureId)
			.orElseThrow(() -> new EumException(ErrorCode.STUDENT_NOT_FOUND));

		return studentOverview.getExamSubmissionInfo().stream()
			.map(ExamSubmissionInfoResponse::fromExamSubmission)
			.collect(Collectors.toList());
	}
}
