package com.eum.lecture_service.command.service.homework;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

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

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HomeworkSubmissionServiceImpl implements HomeworkSubmissionService {

	private final HomeworkRepository homeworkRepository;
	private final HomeworkSubmissionRepository homeworkSubmissionRepository;
	private final HomeworkProblemSubmissionRepository homeworkProblemSubmissionRepository;

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

		// 문제 제출 저장
		HomeworkSubmission finalHomeworkSubmission = homeworkSubmission;
		List<HomeworkProblemSubmission> homeworkProblemSubmissionList = homeworkProblemSubmissions.stream()
			.map(dto -> dto.toEntity(finalHomeworkSubmission, studentId))
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

		return homeworkSubmissionRepository.save(homeworkSubmission);
	}
}

