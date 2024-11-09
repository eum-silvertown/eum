package com.eum.lecture_service.command.service.exam;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.kafka.core.KafkaTemplate;
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
import com.eum.lecture_service.event.dto.ExamProblemSubmissionEventDto;
import com.eum.lecture_service.event.event.exam.ExamSubmissionCreateEvent;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExamSubmissionServiceImpl implements ExamSubmissionService {

	private final ExamRepository examRepository;
	private final ExamSubmissionRepository examSubmissionRepository;
	private final ExamProblemSubmissionRepository examProblemSubmissionRepository;
	private final KafkaTemplate<String, Object> kafkaTemplate;

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

		ExamSubmission savedExam = examSubmissionRepository.save(examSubmission);

		// 문제 제출 저장
		List<ExamProblemSubmission> examProblemSubmissionList = problemSubmissions.stream()
			.map(dto -> {
				return dto.toEntity(savedExam, studentId);
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

		ExamSubmission saved = examSubmissionRepository.save(examSubmission);

		publishExamSubmissionCreateEvent(examSubmission, examProblemSubmissionList, exam.getLecture().getLectureId());

		return saved;

	}

	private void publishExamSubmissionCreateEvent(ExamSubmission examSubmission, List<ExamProblemSubmission> examProblemSubmissionList, Long lectureId) {

		ExamSubmissionCreateEvent event = new ExamSubmissionCreateEvent();
		event.setExamSubmissionId(examSubmission.getExamSubmissionId());
		event.setExamId(examSubmission.getExam().getExamId());
		event.setStudentId(examSubmission.getStudentId());
		event.setLectureId(lectureId);
		event.setScore(examSubmission.getScore());
		event.setCorrectCount(examSubmission.getCorrectCount());
		event.setTotalCount(examSubmission.getTotalCount());

		List<ExamProblemSubmissionEventDto> problemSubmissionEventDtoList = examProblemSubmissionList.stream()
			.map(submission -> ExamProblemSubmissionEventDto.builder()
				.examProblemSubmissionId(submission.getExamProblemSubmissionId())
				.questionId(submission.getQuestionId())
				.isCorrect(submission.getIsCorrect())
				.examSolution(submission.getExamSolution())
				.build())
			.collect(Collectors.toList());

		event.setProblemSubmissions(problemSubmissionEventDtoList);

		kafkaTemplate.send("exam-submission-event", event);
	}
}
