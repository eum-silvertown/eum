package com.eum.lecture_service.command.service.homework;

import java.util.ArrayList;
import java.util.List;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.eum.lecture_service.command.dto.homework.HomeworkDto;
import com.eum.lecture_service.command.entity.homework.Homework;
import com.eum.lecture_service.command.entity.homework.HomeworkQuestion;
import com.eum.lecture_service.command.entity.lecture.Lecture;
import com.eum.lecture_service.command.repository.homework.HomeworkRepository;
import com.eum.lecture_service.command.repository.lecture.LectureRepository;
import com.eum.lecture_service.config.exception.ErrorCode;
import com.eum.lecture_service.config.exception.EumException;
import com.eum.lecture_service.event.event.homework.HomeworkCreateEvent;
import com.eum.lecture_service.event.event.homework.HomeworkDeleteEvent;
import com.eum.lecture_service.event.event.homework.HomeworkUpdateEvent;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HomeworkServiceImpl implements HomeworkService {

	private final HomeworkRepository homeworkRepository;
	private final LectureRepository lectureRepository;
	private final KafkaTemplate<String, Object> kafkaTemplate;

	@Override
	public Long createHomework(HomeworkDto homeworkDto) {
		Lecture lecture = lectureRepository.findById(homeworkDto.getLectureId())
			.orElseThrow(() -> new EumException(ErrorCode.LECTURE_NOT_FOUND));

		//같은 제목의 홈워크있을시 오류
		List<Homework> homeworks = lecture.getHomeworks();
		for(Homework homework : homeworks) {
			if(homework.getTitle().equals(homeworkDto.getTitle())) {
				throw new EumException(ErrorCode.HOMEWORK_TITLE_DUPLICATE);
			}
		}

		Homework homework = homeworkDto.toHomeworkEntity(lecture);

		List<HomeworkQuestion> homeworkQuestions = new ArrayList<>();
		// 문제 ID 리스트 처리
		for (Long questionId : homeworkDto.getQuestionIds()) {
			HomeworkQuestion homeworkQuestion = HomeworkQuestion.builder()
				.homework(homework)
				.questionId(questionId)
				.build();
			homeworkQuestions.add(homeworkQuestion);
		}
		homework.setHomeworkQuestions(homeworkQuestions);
		Homework savedHomework = homeworkRepository.save(homework);

		HomeworkCreateEvent event = HomeworkCreateEvent.builder()
			.homeworkId(savedHomework.getHomeworkId())
			.lectureId(savedHomework.getLecture().getLectureId())
			.title(savedHomework.getTitle())
			.startTime(savedHomework.getStartTime())
			.endTime(savedHomework.getEndTime())
			.questionIds(homeworkDto.getQuestionIds())
			.build();

		kafkaTemplate.send("homework-create-topic", event);

		return savedHomework.getHomeworkId();
	}

	@Override
	public Long updateHomework(Long homeworkId, HomeworkDto homeworkDto) {
		Homework homework = homeworkRepository.findById(homeworkId)
			.orElseThrow(() -> new EumException(ErrorCode.HOMEWORK_NOT_FOUND));

		List<Homework> homeworks = homework.getLecture().getHomeworks();
		for(Homework findhomework : homeworks) {
			if(findhomework.getTitle().equals(homeworkDto.getTitle())) {
				throw new EumException(ErrorCode.HOMEWORK_TITLE_DUPLICATE);
			}
		}
		if(homeworkDto.getTitle() != null) {
			homework.setTitle(homeworkDto.getTitle());
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

		// 카프카 이벤트 발행
		HomeworkUpdateEvent event = HomeworkUpdateEvent.builder()
			.homeworkId(savedHomework.getHomeworkId())
			.lectureId(savedHomework.getLecture().getLectureId())
			.title(savedHomework.getTitle())
			.startTime(savedHomework.getStartTime())
			.endTime(savedHomework.getEndTime())
			.questionIds(homeworkDto.getQuestionIds())
			.build();

		kafkaTemplate.send("homework-update-topic", event);

		return savedHomework.getHomeworkId();
	}

	@Override
	public void deleteHomework(Long homeworkId) {
		Homework homework = homeworkRepository.findById(homeworkId)
			.orElseThrow(() -> new EumException(ErrorCode.HOMEWORK_NOT_FOUND));

		HomeworkDeleteEvent event = HomeworkDeleteEvent.builder()
			.homeworkId(homeworkId)
			.lectureId(homework.getLecture().getLectureId())
			.build();

		kafkaTemplate.send("homework-delete-topic",  event);

		homeworkRepository.delete(homework);
	}
}
