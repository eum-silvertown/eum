package com.eum.lecture_service.command.service.exam;

import com.eum.lecture_service.command.dto.exam.ExamDto;
import com.eum.lecture_service.command.entity.exam.Exam;

public interface ExamService {

	Long createExam(ExamDto examDto);

	Long updateExam(Long examId, ExamDto examDto);

	void deleteExam(Long examId);
}
