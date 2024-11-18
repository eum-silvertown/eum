package com.eum.lecture_service.command.service.homework;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
import com.eum.lecture_service.event.event.notification.HomeworkCreatedNotificationEvent;
import com.eum.lecture_service.query.document.eventModel.StudentModel;
import com.eum.lecture_service.query.repository.StudentReadRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HomeworkServiceImpl implements HomeworkService {

	private final HomeworkRepository homeworkRepository;
	private final LectureRepository lectureRepository;
	private final StudentReadRepository studentReadRepository;
	private final KafkaTemplate<String, Object> kafkaTemplate;

	@Override
	@Transactional
	public Long createHomework(HomeworkDto homeworkDto) {
		Lecture lecture = lectureRepository.findById(homeworkDto.getLectureId())
			.orElseThrow(() -> new EumException(ErrorCode.LECTURE_NOT_FOUND));
		checkDuplicateTitle(lecture.getHomeworks(), homeworkDto.getTitle());

		Homework homework = homeworkDto.toHomeworkEntity(lecture);
		homework.setHomeworkQuestions(createHomeworkQuestions(homeworkDto.getQuestionIds(), homework));

		Homework savedHomework = homeworkRepository.save(homework);

		publishHomeworkCreateEvent(savedHomework, homeworkDto.getQuestionIds());

		//알림이벤트
		publishHomeworkNotificationCreateEvent(savedHomework, lecture);

		return savedHomework.getHomeworkId();
	}


	@Override
	@Transactional
	public Long updateHomework(Long homeworkId, HomeworkDto homeworkDto) {
		Homework homework = homeworkRepository.findById(homeworkId)
			.orElseThrow(() -> new EumException(ErrorCode.HOMEWORK_NOT_FOUND));

		checkDuplicateTitle(homework.getLecture().getHomeworks(), homeworkDto.getTitle());

		updateHomeworkDetails(homework, homeworkDto);

		Homework savedHomework = homeworkRepository.save(homework);

		publishHomeworkUpdateEvent(savedHomework, homeworkDto.getQuestionIds());

		return savedHomework.getHomeworkId();
	}

	@Override
	@Transactional
	public void deleteHomework(Long homeworkId) {
		Homework homework = homeworkRepository.findById(homeworkId)
			.orElseThrow(() -> new EumException(ErrorCode.HOMEWORK_NOT_FOUND));

		publishHomeworkDeleteEvent(homework);

		homeworkRepository.delete(homework);
	}

	private void checkDuplicateTitle(List<Homework> homeworks, String title) {
		homeworks.stream()
			.filter(hw -> hw.getTitle().equals(title))
			.findAny()
			.ifPresent(hw -> {
				throw new EumException(ErrorCode.HOMEWORK_TITLE_DUPLICATE);
			});
	}

	private List<HomeworkQuestion> createHomeworkQuestions(List<Long> questionIds, Homework homework) {
		return questionIds.stream()
			.map(questionId -> HomeworkQuestion.builder()
				.homework(homework)
				.questionId(questionId)
				.build())
			.collect(Collectors.toList());
	}

	private void updateHomeworkDetails(Homework homework, HomeworkDto homeworkDto) {
		if (homeworkDto.getTitle() != null) {
			homework.setTitle(homeworkDto.getTitle());
		}
		if (homeworkDto.getStartTime() != null) {
			homework.setStartTime(homeworkDto.getStartTime());
		}
		if (homeworkDto.getEndTime() != null) {
			homework.setEndTime(homeworkDto.getEndTime());
		}
		if (homeworkDto.getQuestionIds() != null) {
			homework.setHomeworkQuestions(createHomeworkQuestions(homeworkDto.getQuestionIds(), homework));
		}
	}

	private void publishHomeworkCreateEvent(Homework homework, List<Long> questionIds) {
		HomeworkCreateEvent event = new HomeworkCreateEvent(
			homework.getHomeworkId(),
			homework.getLecture().getLectureId(),
			homework.getTitle(),
			homework.getStartTime(),
			homework.getEndTime(),
			questionIds
		);
		kafkaTemplate.send("homework-create-topic", event);
	}

	private void publishHomeworkUpdateEvent(Homework homework, List<Long> questionIds) {
		HomeworkUpdateEvent event = new HomeworkUpdateEvent(
			homework.getHomeworkId(),
			homework.getLecture().getLectureId(),
			homework.getTitle(),
			homework.getStartTime(),
			homework.getEndTime(),
			questionIds
		);
		kafkaTemplate.send("homework-update-topic", event);
	}

	private void publishHomeworkDeleteEvent(Homework homework) {
		HomeworkDeleteEvent event = new HomeworkDeleteEvent(
			homework.getHomeworkId(),
			homework.getLecture().getLectureId()
		);
		kafkaTemplate.send("homework-delete-topic", event);
	}

	private List<Long> getStudentIds(Long classId) {
		List<StudentModel> studentModels = studentReadRepository.findByClassId(classId);

		return studentModels.stream()
			.map(StudentModel::getStudentId)
			.collect(Collectors.toList());
	}

	private void publishHomeworkNotificationCreateEvent(Homework savedHomework, Lecture lecture) {
		List<Long> studentIds = getStudentIds(savedHomework.getLecture().getClassId());

		HomeworkCreatedNotificationEvent event = HomeworkCreatedNotificationEvent.of(savedHomework, studentIds, lecture.getSubject());
		kafkaTemplate.send("homework-created-notification-topic", event);
	}
}
