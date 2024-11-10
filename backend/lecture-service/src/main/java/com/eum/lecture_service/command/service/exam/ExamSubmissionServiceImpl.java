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

		validateExamTime(exam);

		ExamSubmission examSubmission = findOrCreateExamSubmission(exam, studentId);

		List<ExamProblemSubmission> examProblemSubmissionList = saveExamProblemSubmissions(
			problemSubmissions, examSubmission, studentId);

		updateExamSubmissionScores(examSubmission, examProblemSubmissionList);

		publishExamSubmissionCreateEvent(examSubmission, examProblemSubmissionList, exam.getLecture().getLectureId());

		return examSubmission;
	}

	private void validateExamTime(Exam exam) {
		LocalDateTime now = LocalDateTime.now();
		if (now.isBefore(exam.getStartTime()) || now.isAfter(exam.getEndTime())) {
			throw new EumException(ErrorCode.EXAM_TIME_INVALID);
		}
	}

	private ExamSubmission findOrCreateExamSubmission(Exam exam, Long studentId) {
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

		return examSubmissionRepository.save(examSubmission);
	}

	private List<ExamProblemSubmission> saveExamProblemSubmissions(
		List<ExamProblemSubmissionDto> problemSubmissions,
		ExamSubmission examSubmission,
		Long studentId) {

		List<ExamProblemSubmission> examProblemSubmissionList = problemSubmissions.stream()
			.map(dto -> dto.toEntity(examSubmission, studentId))
			.collect(Collectors.toList());

		return examProblemSubmissionRepository.saveAll(examProblemSubmissionList);
	}


	private void updateExamSubmissionScores(ExamSubmission examSubmission,
		List<ExamProblemSubmission> examProblemSubmissionList) {
		Long correctCount = examProblemSubmissionList.stream()
			.filter(ExamProblemSubmission::getIsCorrect)
			.count();

		Long totalCount = (long) examProblemSubmissionList.size();
		double score = (double) correctCount / totalCount * 100;

		examSubmission.setCorrectCount(correctCount);
		examSubmission.setTotalCount(totalCount);
		examSubmission.setScore(score);
		examSubmission.setCompleted(true);

		examSubmissionRepository.save(examSubmission);
	}

	private void publishExamSubmissionCreateEvent(ExamSubmission examSubmission,
		List<ExamProblemSubmission> examProblemSubmissionList,
		Long lectureId) {

		ExamSubmissionCreateEvent event = createExamSubmissionCreateEvent(examSubmission, lectureId, examProblemSubmissionList);

		kafkaTemplate.send("exam-submission-event", event);
	}

	private ExamSubmissionCreateEvent createExamSubmissionCreateEvent(ExamSubmission examSubmission,
		Long lectureId,
		List<ExamProblemSubmission> examProblemSubmissionList) {
		ExamSubmissionCreateEvent event = new ExamSubmissionCreateEvent();
		event.setExamSubmissionId(examSubmission.getExamSubmissionId());
		event.setExamId(examSubmission.getExam().getExamId());
		event.setStudentId(examSubmission.getStudentId());
		event.setLectureId(lectureId);
		event.setScore(examSubmission.getScore());
		event.setCorrectCount(examSubmission.getCorrectCount());
		event.setTotalCount(examSubmission.getTotalCount());
		event.setProblemSubmissions(createProblemSubmissionEvents(examProblemSubmissionList));
		return event;
	}

	private List<ExamProblemSubmissionEventDto> createProblemSubmissionEvents(
		List<ExamProblemSubmission> examProblemSubmissionList) {
		return examProblemSubmissionList.stream()
			.map(this::toExamProblemSubmissionEventDto)
			.collect(Collectors.toList());
	}

	private ExamProblemSubmissionEventDto toExamProblemSubmissionEventDto(ExamProblemSubmission submission) {
		return new ExamProblemSubmissionEventDto(
			submission.getExamProblemSubmissionId(),
			submission.getQuestionId(),
			submission.getIsCorrect(),
			submission.getExamSolution()
		);
	}
}
