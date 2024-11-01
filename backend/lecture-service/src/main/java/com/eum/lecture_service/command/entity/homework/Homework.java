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
@Table(name = "homeworks")
public class Homework {

	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "homework_id")
	private Long homeworkId;

	@Column(name = "lecture_id", nullable = false)
	private Long lectureId;

	@Column(name = "folder_id", nullable = false)
	private Long folderId;

	@Column(name = "title", nullable = false, length = 100)
	private String title;

	@Column(name = "start_time", nullable = false)
	private LocalDateTime startTime;

	@Column(name = "end_time", nullable = false)
	private LocalDateTime endTime;
}
