package com.eum.lecture_service.command.entity.exam;

import com.eum.lecture_service.command.entity.homework.Homework;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "exam_problem_submissions")
public class ExamProblemSubmission {

	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "exam_problem_submission_id")
	private Long examProblemSubmissionId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "exam_submission_id")
	private ExamSubmission examSubmission;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "homework_id", nullable = false)
	private Homework homework;

	@Column(name = "problem_id", nullable = false)
	private Long problemId;

	@Column(name = "student_id", nullable = false)
	private Long studentId;

	@Column(name = "is_correct")
	private Boolean isCorrect;
}
