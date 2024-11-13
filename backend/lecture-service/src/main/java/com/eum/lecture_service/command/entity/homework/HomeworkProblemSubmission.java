package com.eum.lecture_service.command.entity.homework;

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
import lombok.Setter;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "homework_question_submissions")
public class HomeworkProblemSubmission {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "homework_question_submission_id")
	private Long homeworkProblemSubmissionId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "homework_submission_id")
	private HomeworkSubmission homeworkSubmission;

	@Column(name = "question_id", nullable = false)
	private Long questionId;

	@Column(name = "student_id", nullable = false)
	private Long studentId;

	@Setter
	@Column(name = "is_correct")
	private Boolean isCorrect;

	@Setter
	@Column(name = "homework_solution")
	private String homeworkSolution;
}

