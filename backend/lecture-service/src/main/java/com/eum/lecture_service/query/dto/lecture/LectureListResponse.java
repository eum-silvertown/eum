package com.eum.lecture_service.query.dto.lecture;

import java.util.List;
import java.util.stream.Collectors;

import com.eum.lecture_service.query.document.LectureModel;
import com.eum.lecture_service.query.document.lectureInfo.ScheduleInfo;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LectureListResponse {

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
	private List<String> scheduleDays;
	private Long lecture_period;

	public static LectureListResponse fromLectureModel(LectureModel lecture) {
		return LectureListResponse.builder()
			.lectureId(lecture.getLectureId())
			.title(lecture.getTitle())
			.subject(lecture.getSubject())
			.introduction(lecture.getIntroduction())
			.backgroundColor(lecture.getBackgroundColor())
			.fontColor(lecture.getFontColor())
			.year(lecture.getYear())
			.semester(lecture.getSemester())
			.classId(lecture.getClassId())
			.teacherId(lecture.getTeacherId())
			.scheduleDays(lecture.getSchedule().stream()
				.map(ScheduleInfo::getDay)
				.distinct()
				.collect(Collectors.toList()))
			.build();
	}

	public static LectureListResponse fromLectureModelWithPeriod(LectureModel lecture, String day) {
		Long period = lecture.getSchedule().stream()
			.filter(s -> s.getDay().equals(day))
			.map(ScheduleInfo::getPeriod)
			.findFirst()
			.orElse(null);
		LectureListResponse lectureListResponse = fromLectureModel(lecture);
		lectureListResponse.setLecture_period(period);
		return lectureListResponse;
	}
}