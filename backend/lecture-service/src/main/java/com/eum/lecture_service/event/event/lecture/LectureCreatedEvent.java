package com.eum.lecture_service.event.event.lecture;

import java.util.List;
import java.util.stream.Collectors;

import com.eum.lecture_service.command.dto.lecture.LectureScheduleDto;
import com.eum.lecture_service.command.entity.lecture.Lecture;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LectureCreatedEvent {

	private Long lectureId;
	private String title;
	private String subject;
	private String introduction;
	private String backgroundColor;
	private String fontColor;
	private Long year;
	private Long semester;
	private Long classId;
	private Long teacherId;
	private List<LectureScheduleDto> schedule;
	private Boolean lectureStatus;

	public LectureCreatedEvent(Lecture lecture) {
		this.lectureId = lecture.getLectureId();
		this.title = lecture.getTitle();
		this.subject = lecture.getSubject();
		this.introduction = lecture.getIntroduction();
		this.backgroundColor = lecture.getBackgroundColor();
		this.fontColor = lecture.getFontColor();
		this.year = lecture.getYear();
		this.semester = lecture.getSemester();
		this.teacherId = lecture.getTeacherId();
		this.classId = lecture.getClassId();
		this.lectureStatus = lecture.getLectureStatus();
		this.schedule = lecture.getLectureSchedules().stream()
			.map(s -> new LectureScheduleDto(s.getDay(), s.getPeriod()))
			.collect(Collectors.toList());
	}
}
