package com.eum.lecture_service.command.repository.exam;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eum.lecture_service.command.entity.exam.ExamProblemSubmission;

public interface ExamProblemSubmissionRepository extends JpaRepository<ExamProblemSubmission, Integer> {
}
