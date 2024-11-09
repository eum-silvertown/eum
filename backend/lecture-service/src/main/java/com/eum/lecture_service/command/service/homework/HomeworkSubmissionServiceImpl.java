package com.eum.lecture_service.command.service.homework;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.eum.lecture_service.command.dto.homework.HomeworkProblemSubmissionDto;
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
	public HomeworkSubmission submitHomeworkProblems(Long homeworkId, Long studentId,
		List<HomeworkProblemSubmissionDto> homeworkProblemSubmissions) {

		Homework homework = homeworkRepository.findById(homeworkId)
			.orElseThrow(() -> new EumException(ErrorCode.HOMEWORK_NOT_FOUND));

		LocalDateTime now = LocalDateTime.now();
		if (now.isBefore(homework.getStartTime()) || now.isAfter(homework.getEndTime())) {
			throw new EumException(ErrorCode.HOMEWORK_NOT_FOUND);
		}

		// 새로운 HomeworkSubmission 생성
		HomeworkSubmission homeworkSubmission = HomeworkSubmission.builder()
			.homework(homework)
			.studentId(studentId)
			.build();

		HomeworkSubmission savedHomeworkSubmission = homeworkSubmissionRepository.save(homeworkSubmission);

		// 문제 제출 저장
		List<HomeworkProblemSubmission> homeworkProblemSubmissionList = homeworkProblemSubmissions.stream()
			.map(dto -> dto.toEntity(savedHomeworkSubmission, studentId))
			.collect(Collectors.toList());

		homeworkProblemSubmissionRepository.saveAll(homeworkProblemSubmissionList);

		Long correctCount = homeworkProblemSubmissionList.stream()
			.filter(HomeworkProblemSubmission::getIsCorrect)
			.count();
		Long totalCount = (long) homeworkProblemSubmissionList.size();
		double score = (double) correctCount / totalCount * 100;

		// HomeworkSubmission 업데이트
		homeworkSubmission.setCorrectCount(correctCount);
		homeworkSubmission.setTotalCount(totalCount);
		homeworkSubmission.setScore(score);

		HomeworkSubmission saved = homeworkSubmissionRepository.save(homeworkSubmission);

		publishHomeworkSubmissionCreateEvent(homeworkSubmission, homeworkProblemSubmissionList, homework.getLecture().getLectureId());

		return saved;
	}

	private void publishHomeworkSubmissionCreateEvent(HomeworkSubmission homeworkSubmission, List<HomeworkProblemSubmission> homeworkProblemSubmissionList, Long lectureId) {

		HomeworkSubmissionCreateEvent event = new HomeworkSubmissionCreateEvent();
		event.setHomeworkSubmissionId(homeworkSubmission.getHomeworkSubmissionId());
		event.setHomeworkId(homeworkSubmission.getHomework().getHomeworkId());
		event.setStudentId(homeworkSubmission.getStudentId());
		event.setScore(homeworkSubmission.getScore());
		event.setCorrectCount(homeworkSubmission.getCorrectCount());
		event.setTotalCount(homeworkSubmission.getTotalCount());
		event.setLectureId(lectureId);

		List<HomeworkProblemSubmissionEventDto> problemSubmissionEvents = homeworkProblemSubmissionList.stream()
			.map(submission -> HomeworkProblemSubmissionEventDto.builder()
				.homeworkProblemSubmissionId(submission.getHomeworkProblemSubmissionId())
				.questionId(submission.getQuestionId())
				.isCorrect(submission.getIsCorrect())
				.homeworkSolution(submission.getHomeworkSolution())
				.build())
			.collect(Collectors.toList());

		event.setProblemSubmissions(problemSubmissionEvents);

		kafkaTemplate.send("homework-submission-events", event);
	}
}

