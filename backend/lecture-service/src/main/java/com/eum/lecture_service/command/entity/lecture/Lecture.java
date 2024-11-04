package com.eum.lecture_service.command.entity.lecture;

import com.eum.lecture_service.command.dto.lecture.LectureDto;
import com.eum.lecture_service.config.global.BaseEntity;

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
@Table(name = "lectures")
public class Lecture extends BaseEntity {

	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="lecture_id")
	private Long lectureId;

	@Column(name = "teacher_id")
	private Long teacherId;

	@Column(name = "class_id")
	private Long classId;

	@Column(name = "title", nullable = false, length = 100)
	private String title;

	@Column(name = "introduction", columnDefinition = "TEXT")
	private String introduction;

	@Column(name = "subject", nullable = false, length = 50)
	private String subject; //과목

	@Column(name = "background_color", nullable = false, length = 20)
	private String backgroundColor;

	@Column(name = "font_color", nullable = false, length = 20)
	private String fontColor;

	@Column(name = "year", nullable = false)
	private Long year;

	@Column(name = "semester", nullable = false)
	private Long semester;

	public void updateFromDTO(LectureDto dto) {
		this.title = dto.getTitle();
		this.introduction = dto.getIntroduction();
		this.subject = dto.getSubject();
		this.backgroundColor = dto.getBackgroundColor();
		this.fontColor = dto.getFontColor();
		this.year = dto.getYear();
		this.semester = dto.getSemester();
	}
}
