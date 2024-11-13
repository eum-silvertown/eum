package com.eum.lecture_service.command.service.homework;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.eum.lecture_service.command.dto.exam.ExamProblemSubmissionDto;
import com.eum.lecture_service.command.dto.homework.HomeworkProblemSubmissionDto;
import com.eum.lecture_service.command.entity.exam.Exam;
import com.eum.lecture_service.command.entity.exam.ExamProblemSubmission;
import com.eum.lecture_service.command.entity.exam.ExamSubmission;
import com.eum.lecture_service.command.entity.homework.Homework;
import com.eum.lecture_service.command.entity.homework.HomeworkProblemSubmission;
import com.eum.lecture_service.command.entity.homework.HomeworkSubmission;
import com.eum.lecture_service.command.repository.homework.HomeworkProblemSubmissionRepository;
import com.eum.lecture_service.command.repository.homework.HomeworkRepository;
import com.eum.lecture_service.command.repository.homework.HomeworkSubmissionRepository;
import com.eum.lecture_service.config.exception.ErrorCode;
import com.eum.lecture_service.config.exception.EumException;
import com.eum.lecture_service.event.dto.HomeworkProblemSubmissionEventDto;
import com.eum.lecture_service.event.event.homework.HomeworkSubmissionCreateEvent;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HomeworkSubmissionServiceImpl implements HomeworkSubmissionService {

	private final HomeworkRepository homeworkRepository;
	private final HomeworkSubmissionRepository homeworkSubmissionRepository;
	private final HomeworkProblemSubmissionRepository homeworkProblemSubmissionRepository;
	private final KafkaTemplate<String, Object> kafkaTemplate;

	@Override
	@Transactional
	public Long submitHomeworkProblems(Long homeworkId, Long studentId,
		List<HomeworkProblemSubmissionDto> homeworkProblemSubmissions) {

		Homework homework = homeworkRepository.findById(homeworkId)
			.orElseThrow(() -> new EumException(ErrorCode.HOMEWORK_NOT_FOUND));

		validateHomeworkTime(homework);

		HomeworkSubmission homeworkSubmission = findOrCreateHomeworkSubmission(homework, studentId);

		List<HomeworkProblemSubmission> homeworkProblemSubmissionList = saveHomeworkProblemSubmissions(
			homeworkProblemSubmissions, homeworkSubmission, studentId);

		updateHomeworkSubmissionScores(homeworkSubmission, homeworkProblemSubmissionList);

		Long lectureId = homework.getLecture().getLectureId();
		publishHomeworkSubmissionCreateEvent(homeworkSubmission, homeworkProblemSubmissionList, lectureId);

		return homeworkSubmission.getHomeworkSubmissionId();
	}

	private void validateHomeworkTime(Homework homework) {
		LocalDateTime now = LocalDateTime.now();
		if (now.isBefore(homework.getStartTime()) || now.isAfter(homework.getEndTime())) {
			throw new EumException(ErrorCode.HOMEWORK_TIME_INVALID);
		}
	}

	private HomeworkSubmission findOrCreateHomeworkSubmission(Homework homework, Long studentId) {
		HomeworkSubmission homeworkSubmission = homeworkSubmissionRepository.findByHomeworkAndStudentId(homework, studentId)
			.orElse(null);

		if (homeworkSubmission != null && homeworkSubmission.getIsCompleted()) {
			throw new EumException(ErrorCode.EXAM_ALREADY_SUBMITTED);
		}

		if (homeworkSubmission == null) {
			homeworkSubmission = HomeworkSubmission.builder()
				.homework(homework)
				.studentId(studentId)
				.isCompleted(false)
				.build();
		}

		return homeworkSubmissionRepository.save(homeworkSubmission);
	}

	private List<HomeworkProblemSubmission> saveHomeworkProblemSubmissions(
		List<HomeworkProblemSubmissionDto> problemSubmissions,
		HomeworkSubmission homeworkSubmission,
		Long studentId) {

		List<HomeworkProblemSubmission> homeworkProblemSubmissionList = problemSubmissions.stream()
			.map(dto -> dto.toEntity(homeworkSubmission, studentId))
			.collect(Collectors.toList());

		return homeworkProblemSubmissionRepository.saveAll(homeworkProblemSubmissionList);
	}

	private void updateHomeworkSubmissionScores(HomeworkSubmission homeworkSubmission,
		List<HomeworkProblemSubmission> homeworkProblemSubmissionList) {
		Long correctCount = homeworkProblemSubmissionList.stream()
			.filter(HomeworkProblemSubmission::getIsCorrect)
			.count();

		Long totalCount = (long) homeworkProblemSubmissionList.size();
		double score = totalCount > 0 ? ((double) correctCount / totalCount) * 100 : 0.0;

		homeworkSubmission.setCorrectCount(correctCount);
		homeworkSubmission.setTotalCount(totalCount);
		homeworkSubmission.setScore(score);
		homeworkSubmission.setIsCompleted(true);

		homeworkSubmissionRepository.save(homeworkSubmission);
	}

	private void publishHomeworkSubmissionCreateEvent(HomeworkSubmission homeworkSubmission,
		List<HomeworkProblemSubmission> homeworkProblemSubmissionList,
		Long lectureId) {

		HomeworkSubmissionCreateEvent event = createHomeworkSubmissionCreateEvent(homeworkSubmission, lectureId, homeworkProblemSubmissionList);
		kafkaTemplate.send("homework-submission-event", event);
	}

	private HomeworkSubmissionCreateEvent createHomeworkSubmissionCreateEvent(HomeworkSubmission homeworkSubmission, Long lectureId, List<HomeworkProblemSubmission> homeworkProblemSubmissionList) {
		HomeworkSubmissionCreateEvent event = new HomeworkSubmissionCreateEvent();
		event.setHomeworkSubmissionId(homeworkSubmission.getHomeworkSubmissionId());
		event.setHomeworkId(homeworkSubmission.getHomework().getHomeworkId());
		event.setStudentId(homeworkSubmission.getStudentId());
		event.setScore(homeworkSubmission.getScore());
		event.setCorrectCount(homeworkSubmission.getCorrectCount());
		event.setTotalCount(homeworkSubmission.getTotalCount());
		event.setLectureId(lectureId);
		event.setIsComplete(homeworkSubmission.getIsCompleted());
		event.setProblemSubmissions(createProblemSubmissionEvents(homeworkProblemSubmissionList));
		return event;
	}

	private List<HomeworkProblemSubmissionEventDto> createProblemSubmissionEvents(
		List<HomeworkProblemSubmission> homeworkProblemSubmissionList) {
		return homeworkProblemSubmissionList.stream()
			.map(this::toHomeworkProblemSubmissionEventDto)
			.collect(Collectors.toList());
	}

	private HomeworkProblemSubmissionEventDto toHomeworkProblemSubmissionEventDto(HomeworkProblemSubmission submission) {
		return new HomeworkProblemSubmissionEventDto(
			submission.getHomeworkProblemSubmissionId(),
			submission.getQuestionId(),
			submission.getIsCorrect(),
			submission.getHomeworkSolution()
		);
	}
}
