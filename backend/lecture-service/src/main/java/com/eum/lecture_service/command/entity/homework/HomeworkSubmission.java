package com.eum.lecture_service.command.entity.homework;

import java.time.LocalDateTime;
import java.util.List;

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
@Table(name = "homework_submissions")
public class HomeworkSubmission {

	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "homework_submission_id")
	private Long homeworkSubmissionId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "homework_id", nullable = false)
	private Homework homework;

	@Column(name = "student_id", nullable = false)
	private Long studentId;

	@Column(name = "score")
	private Double score;

	@Column(name = "correct_count")
	private Integer correctCount;

	@Column(name = "total_count")
	private Integer totalCount;

	@Column(name = "is_completed")
	private Boolean isCompleted;

	@OneToMany(mappedBy = "homeworkSubmission", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<HomeworkProblemSubmission> homeworkProblemSubmissions;
}
