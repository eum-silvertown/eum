package com.eum.lecture_service.command.dto.lecture;

import java.util.List;
import java.util.stream.Collectors;

import com.eum.lecture_service.command.entity.lecture.Lecture;
import com.eum.lecture_service.command.entity.lecture.LectureSchedule;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class
LectureDto {

	private String title;
	private String subject;
	private String introduction;
	private String backgroundColor;
	private String fontColor;
	private Long classId;
	private Long year;
	private Long semester;
	private List<Schedule> schedule;

	@Getter
	@Builder
	public static class Schedule {
		private String day; // 요일
		private long period; // 교시

	}

	public Lecture toLectureEntity(Long teacherId) {
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
