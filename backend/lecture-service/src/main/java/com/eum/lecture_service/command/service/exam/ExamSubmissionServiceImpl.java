package com.eum.lecture_service.command.service.exam;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.eum.lecture_service.command.dto.exam.ExamProblemSubmissionDto;
import com.eum.lecture_service.command.entity.exam.Exam;
import com.eum.lecture_service.command.entity.exam.ExamProblemSubmission;
import com.eum.lecture_service.command.entity.exam.ExamSubmission;
import com.eum.lecture_service.command.repository.exam.ExamProblemSubmissionRepository;
import com.eum.lecture_service.command.repository.exam.ExamRepository;
import com.eum.lecture_service.command.repository.exam.ExamSubmissionRepository;
import com.eum.lecture_service.config.exception.ErrorCode;
import com.eum.lecture_service.config.exception.EumException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExamSubmissionServiceImpl implements ExamSubmissionService {

	private final ExamRepository examRepository;
	private final ExamSubmissionRepository examSubmissionRepository;
	private final ExamProblemSubmissionRepository examProblemSubmissionRepository;

	@Override
	@Transactional
	public ExamSubmission submitExamProblems(Long examId, Long studentId,
		List<ExamProblemSubmissionDto> problemSubmissions) {

		Exam exam = examRepository.findById(examId)
			.orElseThrow(() -> new EumException(ErrorCode.EXAM_NOT_FOUND));

		LocalDateTime now = LocalDateTime.now();
		if (now.isBefore(exam.getStartTime()) || now.isAfter(exam.getEndTime())) {
			throw new EumException(ErrorCode.EXAM_TIME_INVALID);
		}

		ExamSubmission examSubmission = examSubmissionRepository.findByExamAndStudentId(exam, studentId)
			.orElse(null);

		if (examSubmission != null && examSubmission.isCompleted()) {
			throw new EumException(ErrorCode.EXAM_ALREADY_SUBMITTED);
		}

		if (examSubmission == null) {
			examSubmission = ExamSubmission.builder()
				.exam(exam)
				.studentId(studentId)
				.isCompleted(false)
				.build();
		}

		// 문제 제출 저장
		ExamSubmission finalExamSubmission = examSubmission;
		List<ExamProblemSubmission> examProblemSubmissionList = problemSubmissions.stream()
			.map(dto -> {
				return dto.toEntity(finalExamSubmission, studentId);
			})
			.collect(Collectors.toList());

		examProblemSubmissionRepository.saveAll(examProblemSubmissionList);

		Long correctCount =examProblemSubmissionList.stream()
			.filter(ExamProblemSubmission::getIsCorrect)
			.count();
		Long totalCount = (long)examProblemSubmissionList.size();
		double score = (double) correctCount / totalCount * 100;

		// ExamSubmission 업데이트
		examSubmission.setCorrectCount(correctCount);
		examSubmission.setTotalCount(totalCount);
		examSubmission.setScore(score);
		examSubmission.setCompleted(true);
		return examSubmissionRepository.save(examSubmission);

	}
}
