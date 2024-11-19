package com.eum.lecture_service.command.repository.homework;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eum.lecture_service.command.entity.exam.Exam;
import com.eum.lecture_service.command.entity.exam.ExamSubmission;
import com.eum.lecture_service.command.entity.homework.Homework;
import com.eum.lecture_service.command.entity.homework.HomeworkSubmission;

public interface HomeworkSubmissionRepository extends JpaRepository<HomeworkSubmission, Long> {
	Optional<HomeworkSubmission> findByHomeworkAndStudentId(Homework homework, Long studentId);

}
