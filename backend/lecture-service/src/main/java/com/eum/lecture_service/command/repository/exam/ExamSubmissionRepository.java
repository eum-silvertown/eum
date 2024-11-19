package com.eum.lecture_service.command.repository.exam;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eum.lecture_service.command.entity.exam.Exam;
import com.eum.lecture_service.command.entity.exam.ExamSubmission;

public interface ExamSubmissionRepository extends JpaRepository<ExamSubmission, Long> {
	Optional<ExamSubmission> findByExamAndStudentId(Exam exam, Long studentId);
}
