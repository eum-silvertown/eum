package com.eum.lecture_service.command.entity.homework;

import java.time.LocalDateTime;
import java.util.List;

import com.eum.lecture_service.command.entity.folder.Folder;
import com.eum.lecture_service.command.entity.lecture.Lecture;
import com.eum.lecture_service.config.global.BaseEntity;

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
@Table(name = "homeworks")
public class Homework extends BaseEntity {

	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "homework_id")
	private Long homeworkId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "lecture_id", nullable = false)
	private Lecture lecture;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "folder_id", nullable = false)
	private Folder folder;

	@Column(name = "title", nullable = false, length = 100)
	private String title;

	@Column(name = "start_time", nullable = false)
	private LocalDateTime startTime;

	@Column(name = "end_time", nullable = false)
	private LocalDateTime endTime;

	@OneToMany(mappedBy = "homework", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<HomeworkSubmission> homeworkSubmissions;
}
