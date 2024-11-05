package com.eum.lecture_service.command.service.homework;

import org.springframework.stereotype.Service;

import com.eum.lecture_service.command.dto.homework.HomeworkDto;
import com.eum.lecture_service.command.entity.homework.Homework;
import com.eum.lecture_service.command.entity.homework.HomeworkQuestion;
import com.eum.lecture_service.command.entity.lecture.Lecture;
import com.eum.lecture_service.command.repository.homework.HomeworkRepository;
import com.eum.lecture_service.command.repository.lecture.LectureRepository;
import com.eum.lecture_service.config.exception.ErrorCode;
import com.eum.lecture_service.config.exception.EumException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HomeworkServiceImpl implements HomeworkService {

	private final HomeworkRepository homeworkRepository;
	private final LectureRepository lectureRepository;

	@Override
	public Long createHomework(HomeworkDto homeworkDto) {
		Lecture lecture = lectureRepository.findById(homeworkDto.getLectureId())
			.orElseThrow(() -> new EumException(ErrorCode.LECTURE_NOT_FOUND));

		Homework homework = homeworkDto.toHomeworkEntity(lecture);
		Homework savedHomework = homeworkRepository.save(homework);

		// 문제 ID 리스트 처리
		for (Long questionId : homeworkDto.getQuestionIds()) {
			HomeworkQuestion homeworkQuestion = HomeworkQuestion.builder()
				.homework(savedHomework)
				.questionId(questionId)
				.build();
			savedHomework.getHomeworkQuestions().add(homeworkQuestion);
		}

		return savedHomework.getHomeworkId();
	}

	@Override
	public Long updateHomework(Long homeworkId, HomeworkDto homeworkDto) {
		Homework homework = homeworkRepository.findById(homeworkId)
			.orElseThrow(() -> new EumException(ErrorCode.HOMEWORK_NOT_FOUND));

		if(homeworkDto.getTitle() != null) {
			homework.setTitle(homework.getTitle());
		}
		if(homeworkDto.getStartTime() != null) {
			homework.setStartTime(homeworkDto.getStartTime());
		}
		if(homeworkDto.getEndTime() != null) {
			homework.setEndTime(homeworkDto.getEndTime());
		}

		if (homeworkDto.getQuestionIds() != null) {
			homework.getHomeworkQuestions().clear();

			for (Long questionId : homeworkDto.getQuestionIds()) {
				HomeworkQuestion homeworkQuestion = HomeworkQuestion.builder()
					.homework(homework)
					.questionId(questionId)
					.build();
				homework.getHomeworkQuestions().add(homeworkQuestion);
			}
		}

		Homework savedHomework = homeworkRepository.save(homework);
		return savedHomework.getHomeworkId();
	}

	@Override
	public void deleteHomework(Long homeworkId) {
		Homework homework = homeworkRepository.findById(homeworkId)
			.orElseThrow(() -> new EumException(ErrorCode.HOMEWORK_NOT_FOUND));

		homeworkRepository.delete(homework);
	}
}
