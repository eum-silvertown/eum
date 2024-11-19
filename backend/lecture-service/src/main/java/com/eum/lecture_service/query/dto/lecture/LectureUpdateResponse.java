package com.eum.lecture_service.query.dto.lecture;

import java.util.List;

import com.eum.lecture_service.query.document.LectureModel;
import com.eum.lecture_service.query.document.lectureInfo.ScheduleInfo;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LectureUpdateResponse {

	private Long lectureId;
	private String title;
	private String subject;
	private String introduction;
	private String backgroundColor;
	private String fontColor;
	private Long classId;
	private List<ScheduleInfo> schedule;

	public static LectureUpdateResponse fromLectureModel(LectureModel lecture) {
		return LectureUpdateResponse.builder()
			.lectureId(lecture.getLectureId())
			.title(lecture.getTitle())
			.subject(lecture.getSubject())
			.introduction(lecture.getIntroduction())
			.backgroundColor(lecture.getBackgroundColor())
			.fontColor(lecture.getFontColor())
			.classId(lecture.getClassId())
			.schedule(lecture.getSchedule())
			.build();
	}
}
