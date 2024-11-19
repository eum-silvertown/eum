package com.eum.lecture_service.command.service.exam;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.eum.lecture_service.command.dto.exam.ExamDto;
import com.eum.lecture_service.command.entity.exam.Exam;
import com.eum.lecture_service.command.entity.exam.ExamQuestion;
import com.eum.lecture_service.command.entity.lecture.Lecture;
import com.eum.lecture_service.command.repository.exam.ExamRepository;
import com.eum.lecture_service.command.repository.lecture.LectureRepository;
import com.eum.lecture_service.config.exception.ErrorCode;
import com.eum.lecture_service.config.exception.EumException;
import com.eum.lecture_service.event.event.exam.ExamCreateEvent;
import com.eum.lecture_service.event.event.exam.ExamDeleteEvent;
import com.eum.lecture_service.event.event.exam.ExamUpdateEvent;
import com.eum.lecture_service.event.event.notification.ExamCreatedNotificationEvent;
import com.eum.lecture_service.event.event.notification.HomeworkCreatedNotificationEvent;
import com.eum.lecture_service.query.document.eventModel.StudentModel;
import com.eum.lecture_service.query.repository.StudentReadRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExamServiceImpl implements ExamService {

	private final ExamRepository examRepository;
	private final LectureRepository lectureRepository;
	private final KafkaTemplate<String, Object> kafkaTemplate;
	private final StudentReadRepository studentReadRepository;

	@Override
	@Transactional
	public Long createExam(ExamDto examDto) {
		Lecture lecture = lectureRepository.findById(examDto.getLectureId())
			.orElseThrow(() -> new EumException(ErrorCode.LECTURE_NOT_FOUND));

		checkDuplicateExamTitle(lecture.getExams(), examDto.getTitle());

		Exam exam = examDto.toExamEntity(lecture);


		addExamQuestions(exam, examDto.getQuestionIds());
		Exam savedExam = examRepository.save(exam);

		publishExamCreateEvent(savedExam, examDto.getQuestionIds());

		//알림이벤트
		publishExamNotificationCreateEvent(savedExam, lecture);

		return savedExam.getExamId();
	}

	@Override
	@Transactional
	public Long updateExam(Long examId, ExamDto examDto) {
		Exam exam = examRepository.findById(examId)
			.orElseThrow(() -> new EumException(ErrorCode.EXAM_NOT_FOUND));

		checkDuplicateExamTitle(exam.getLecture().getExams(), examDto.getTitle());

		updateExamDetails(exam, examDto);

		Exam savedExam = examRepository.save(exam);

		publishExamUpdateEvent(savedExam, examDto.getQuestionIds());

		return savedExam.getExamId();
	}

	@Override
	@Transactional
	public void deleteExam(Long examId) {
		Exam exam = examRepository.findById(examId)
			.orElseThrow(() -> new EumException(ErrorCode.EXAM_NOT_FOUND));

		publishExamDeleteEvent(exam);

		examRepository.delete(exam);
	}

	private void checkDuplicateExamTitle(List<Exam> exams, String title) {
		exams.stream()
			.filter(exam -> exam.getTitle().equals(title))
			.findAny()
			.ifPresent(exam -> {
				throw new EumException(ErrorCode.EXAM_TITLE_DUPLICATE);
			});
	}

	private void addExamQuestions(Exam savedExam, List<Long> questionIds) {
		questionIds.forEach(questionId -> {
			ExamQuestion examQuestion = ExamQuestion.builder()
				.exam(savedExam)
				.questionId(questionId)
				.build();
			savedExam.getExamQuestions().add(examQuestion);
		});
	}

	private void updateExamDetails(Exam exam, ExamDto examDto) {
		if (examDto.getTitle() != null) {
			exam.setTitle(examDto.getTitle());
		}
		if (examDto.getStartTime() != null) {
			exam.setStartTime(examDto.getStartTime());
		}
		if (examDto.getEndTime() != null) {
			exam.setEndTime(examDto.getEndTime());
		}

		if (examDto.getQuestionIds() != null) {
			exam.getExamQuestions().clear();
			addExamQuestions(exam, examDto.getQuestionIds());
		}
	}

	private void publishExamCreateEvent(Exam exam, List<Long> questionIds) {
		ExamCreateEvent event = new ExamCreateEvent(
			exam.getExamId(),
			exam.getLecture().getLectureId(),
			exam.getTitle(),
			exam.getStartTime(),
			exam.getEndTime(),
			questionIds
		);
		kafkaTemplate.send("exam-create-topic", event);
	}

	private void publishExamUpdateEvent(Exam exam, List<Long> questionIds) {
		ExamUpdateEvent event = new ExamUpdateEvent(
			exam.getExamId(),
			exam.getLecture().getLectureId(),
			exam.getTitle(),
			exam.getStartTime(),
			exam.getEndTime(),
			questionIds
		);
		kafkaTemplate.send("exam-update-topic", event);
	}

	private void publishExamDeleteEvent(Exam exam) {
		ExamDeleteEvent event = new ExamDeleteEvent(
			exam.getExamId(),
			exam.getLecture().getLectureId()
		);
		kafkaTemplate.send("exam-delete-topic", event);
	}

	private List<Long> getStudentIds(Long classId) {
		List<StudentModel> studentModels = studentReadRepository.findByClassId(classId);

		return studentModels.stream()
			.map(StudentModel::getStudentId)
			.collect(Collectors.toList());
	}

	private void publishExamNotificationCreateEvent(Exam savedExam, Lecture lecture) {
		List<Long> studentIds = getStudentIds(savedExam.getLecture().getClassId());

		ExamCreatedNotificationEvent event = ExamCreatedNotificationEvent.of(savedExam, studentIds, lecture.getSubject());
		kafkaTemplate.send("exam-created-notification-topic", event);
	}
}
