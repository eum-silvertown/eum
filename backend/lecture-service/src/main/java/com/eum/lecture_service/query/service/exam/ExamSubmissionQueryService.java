package com.eum.lecture_service.query.service.exam;

import java.util.List;

import com.eum.lecture_service.query.dto.exam.ExamProblemSubmissionInfoResponse;
import com.eum.lecture_service.query.dto.exam.ExamSubmissionInfoResponse;
import com.eum.lecture_service.query.dto.exam.ExamSubmissionsInfoResponse;

public interface ExamSubmissionQueryService {

	ExamSubmissionInfoResponse getStudentExamSubmission(Long lectureId, Long examId, Long studentId);

	List<ExamSubmissionsInfoResponse> getExamSubmissions(Long lectureId, Long examId);

	ExamProblemSubmissionInfoResponse getExamProblemSubmission(Long lectureId, Long examId, Long studentId, Long problemId);

	List<ExamSubmissionInfoResponse> getAllExamSubmissionsByStudent(Long lectureId, Long studentId);
}
