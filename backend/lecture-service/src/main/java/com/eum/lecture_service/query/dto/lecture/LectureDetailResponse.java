package com.eum.lecture_service.query.dto.lecture;

import java.time.LocalDateTime;
import java.util.List;

import com.eum.lecture_service.query.document.LectureModel;
import com.eum.lecture_service.query.document.info.ExamInfo;
import com.eum.lecture_service.query.document.info.HomeworkInfo;
import com.eum.lecture_service.query.document.info.LessonInfo;
import com.eum.lecture_service.query.document.info.NoticeInfo;
import com.eum.lecture_service.query.document.info.ScheduleInfo;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class LectureDetailResponse {

	private Long lectureId;
	private String title;
	private String subject;
	private String backgroundColor;
	private String fontColor;
	private Long year;
	private Long semester;
	private Long classId;
	private Long teacherId;
	private List<ScheduleInfo> schedule;
	private List<NoticeInfo> notices;
	private List<ExamInfo> exams;
	private List<HomeworkInfo> homeworks;
	private List<LessonInfo> lessons;

	public static LectureDetailResponse fromLectureModel(LectureModel lecture) {
		LectureDetailResponse response = new LectureDetailResponse();
		response.setLectureId(lecture.getLectureId());
		response.setTitle(lecture.getTitle());
		response.setSubject(lecture.getSubject());
		response.setBackgroundColor(lecture.getBackgroundColor());
		response.setFontColor(lecture.getFontColor());
		response.setYear(lecture.getYear());
		response.setSemester(lecture.getSemester());
		response.setClassId(lecture.getClassId());
		response.setTeacherId(lecture.getTeacherId());
		response.setSchedule(lecture.getSchedule());
		response.setNotices(lecture.getNotices());
		response.setExams(lecture.getExams());
		response.setHomeworks(lecture.getHomeworks());
		response.setLessons(lecture.getLessons());
		return response;
	}
}
