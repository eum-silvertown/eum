package com.eum.lecture_service.query.dto.lecture;

import java.util.List;
import java.util.stream.Collectors;

import com.eum.lecture_service.query.document.LectureModel;
import com.eum.lecture_service.query.document.eventModel.ClassModel;
import com.eum.lecture_service.query.document.eventModel.TeacherModel;
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
	private Long grade;
	private Long classNumber;
	private Boolean lectureStatus;
	private TeacherModel teacher;
	private List<String> scheduleDays;
	private List<Long> lecture_period;

	public static LectureListResponse fromLectureModel(LectureModel lecture, ClassModel classModel, TeacherModel teacher) {
		return LectureListResponse.builder()
			.lectureId(lecture.getLectureId())
			.title(lecture.getTitle())
			.subject(lecture.getSubject())
			.introduction(lecture.getIntroduction())
			.backgroundColor(lecture.getBackgroundColor())
			.fontColor(lecture.getFontColor())
			.year(lecture.getYear())
			.semester(lecture.getSemester())
			.grade(classModel.getGrade())
			.classNumber(classModel.getClassNumber())
			.lectureStatus(lecture.getLectureStatus())
			.teacher(teacher)
			.scheduleDays(lecture.getSchedule().stream()
				.map(ScheduleInfo::getDay)
				.distinct()
				.collect(Collectors.toList()))
			.build();
	}

	public static LectureListResponse fromLectureModelWithPeriod(LectureModel lecture, String day, ClassModel classModel, TeacherModel teacher) {
		List<Long> period = lecture.getSchedule().stream()
			.filter(s -> s.getDay().equals(day))
			.map(ScheduleInfo::getPeriod)
			.collect(Collectors.toList());
		LectureListResponse lectureListResponse = fromLectureModel(lecture, classModel, teacher);
		lectureListResponse.setLecture_period(period);
		return lectureListResponse;
	}
}
