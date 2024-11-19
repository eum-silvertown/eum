package com.eum.lecture_service.command.repository.homework;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eum.lecture_service.command.entity.homework.HomeworkProblemSubmission;

public interface HomeworkProblemSubmissionRepository extends JpaRepository<HomeworkProblemSubmission, Long> {
}
