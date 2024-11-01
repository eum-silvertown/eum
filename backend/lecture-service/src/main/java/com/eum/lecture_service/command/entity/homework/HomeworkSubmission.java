package com.eum.lecture_service.command.entity.homework;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
@Table(name = "homework_submissions")
public class HomeworkSubmission {

	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "homework_submission_id")
	private Long homeworkSubmissionId;

	@Column(name = "homework_id", nullable = false)
	private Long homeworkId;

	@Column(name = "student_id", nullable = false)
	private Long studentId;

	@Column(name = "score")
	private Double score;

	@Column(name = "correct_count")
	private Integer correctCount;

	@Column(name = "total_count")
	private Integer totalCount;

}
