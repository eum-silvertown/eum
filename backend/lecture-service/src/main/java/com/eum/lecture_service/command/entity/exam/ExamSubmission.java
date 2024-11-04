package com.eum.lecture_service.command.entity.exam;

import java.util.List;

import com.eum.lecture_service.command.entity.homework.Homework;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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
@Table(name = "exam_submissions")
public class ExamSubmission {

	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "exam_submission_id")
	private Long examSubmissionId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "exam_id", nullable = false)
	private Exam exam;

	@Column(name = "student_id", nullable = false)
	private Long studentId;

	@Column(name = "score")
	private Double score;

	@Column(name = "correct_count")
	private Integer correctCount;

	@Column(name = "total_count")
	private Integer totalCount;

	@Column(name = "is_completed")
	private boolean isCompleted;

	@OneToMany(mappedBy = "examSubmission", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<ExamProblemSubmission> examProblemSubmissions;
}
