package com.eum.lecture_service.command.service.exam;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.eum.lecture_service.command.dto.exam.ExamDto;
import com.eum.lecture_service.command.entity.exam.Exam;
import com.eum.lecture_service.command.entity.exam.ExamQuestion;
import com.eum.lecture_service.command.entity.homework.Homework;
import com.eum.lecture_service.command.entity.lecture.Lecture;
import com.eum.lecture_service.command.repository.exam.ExamRepository;
import com.eum.lecture_service.command.repository.lecture.LectureRepository;
import com.eum.lecture_service.config.exception.ErrorCode;
import com.eum.lecture_service.config.exception.EumException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExamServiceImpl implements ExamService{

	private final ExamRepository examRepository;
	private final LectureRepository lectureRepository;

	@Override
	@Transactional
	public Long createExam(ExamDto examDto) {
		Lecture lecture = lectureRepository.findById(examDto.getLectureId())
			.orElseThrow(() -> new EumException(ErrorCode.LECTURE_NOT_FOUND));

		List<Exam> exams = lecture.getExams();
		for(Exam exam : exams) {
			if(exam.getTitle().equals(examDto.getTitle())) {
				throw new EumException(ErrorCode.EXAM_TITLE_DUPLICATE);
			}
		}

		Exam exam = examDto.toExamEntity(lecture);
		Exam savedExam = examRepository.save(exam);

		for(Long questionId : examDto.getQuestionIds()) {
			ExamQuestion examQuestion = ExamQuestion.builder()
				.exam(savedExam)
				.questionId(questionId)
				.build();
			savedExam.getExamQuestions().add(examQuestion);
		}

		return savedExam.getExamId();
	}

	@Override
	@Transactional
	public Long updateExam(Long examId, ExamDto examDto) {
		Exam exam = examRepository.findById(examId)
			.orElseThrow(() -> new EumException(ErrorCode.EXAM_NOT_FOUND));

		List<Exam> exams = exam.getLecture().getExams();
		for(Exam findExam : exams) {
			if(findExam.getTitle().equals(examDto.getTitle())) {
				throw new EumException(ErrorCode.EXAM_TITLE_DUPLICATE);
			}
		}

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

			for(Long questionId : examDto.getQuestionIds()) {
				ExamQuestion examQuestion = ExamQuestion.builder()
					.exam(exam)
					.questionId(questionId)
					.build();
				exam.getExamQuestions().add(examQuestion);
			}
		}

		Exam savedExam = examRepository.save(exam);
		return savedExam.getExamId();
	}

	@Override
	@Transactional
	public void deleteExam(Long examId) {
		Exam exam = examRepository.findById(examId)
			.orElseThrow(() -> new EumException(ErrorCode.EXAM_NOT_FOUND));

		examRepository.delete(exam);
	}
}
