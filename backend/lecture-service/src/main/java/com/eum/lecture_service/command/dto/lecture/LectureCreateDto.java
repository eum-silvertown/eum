package com.eum.lecture_service.command.dto.lecture;

import java.util.List;
import java.util.stream.Collectors;

import com.eum.lecture_service.command.entity.lecture.Lecture;
import com.eum.lecture_service.command.entity.lecture.LectureSchedule;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LectureCreateDto {

	private String title;
	private String subject;
	private String introduction;
	private String backgroundColor;
	private String fontColor;
	private Long grade;
	private Long classNumber;
	private String school;
	private Long year;
	private Long semester;
	private List<LectureScheduleDto> schedule;

	public Lecture toLectureEntity(Long teacherId, Long classId) {
		return Lecture.builder()
			.teacherId(teacherId)
			.classId(classId)
			.title(title)
			.introduction(introduction)
			.subject(subject)
			.backgroundColor(backgroundColor)
			.fontColor(fontColor)
			.year(year)
			.semester(semester)
			.build();
	}

	public List<LectureSchedule> toLectureScheduleEntities(Lecture lecture) {
		return schedule.stream()
			.map(s -> LectureSchedule.builder()
				.lecture(lecture)
				.day(s.getDay())
				.period(s.getPeriod())
				.build())
			.collect(Collectors.toList());
	}
}
