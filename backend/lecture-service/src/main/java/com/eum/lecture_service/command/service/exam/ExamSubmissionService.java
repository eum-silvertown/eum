package com.eum.lecture_service.command.service.exam;

import java.util.List;

import com.eum.lecture_service.command.dto.exam.ExamProblemSubmissionDto;
import com.eum.lecture_service.command.entity.exam.ExamSubmission;

public interface ExamSubmissionService {

	Long submitExamProblems(Long examId, Long studentId, List<ExamProblemSubmissionDto> problemSubmissions);
}
