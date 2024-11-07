package com.eum.lecture_service.query.dto.lecture;

import java.util.List;

import com.eum.lecture_service.query.document.LectureModel;
import com.eum.lecture_service.query.document.StudentOverviewModel;
import com.eum.lecture_service.query.document.TeacherOverviewModel;
import com.eum.lecture_service.query.document.eventModel.TeacherModel;
import com.eum.lecture_service.query.document.lectureInfo.ExamInfo;
import com.eum.lecture_service.query.document.lectureInfo.HomeworkInfo;
import com.eum.lecture_service.query.document.lectureInfo.LessonInfo;
import com.eum.lecture_service.query.document.lectureInfo.NoticeInfo;
import com.eum.lecture_service.query.document.lectureInfo.ScheduleInfo;

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
	private TeacherModel teacherModel;
	private List<ScheduleInfo> schedule;
	private List<NoticeInfo> notices;
	private List<ExamInfo> exams;
	private List<HomeworkInfo> homeworks;
	private List<LessonInfo> lessons;
	private StudentOverviewModel studentOverviewModel;
	private TeacherOverviewModel teacherOverviewModel;

	public static LectureDetailResponse fromLectureModelForStudent(LectureModel lecture, TeacherModel teacherModel, StudentOverviewModel studentOverviewModel) {
		LectureDetailResponse response = new LectureDetailResponse();
		response.setLectureId(lecture.getLectureId());
		response.setTitle(lecture.getTitle());
		response.setSubject(lecture.getSubject());
		response.setBackgroundColor(lecture.getBackgroundColor());
		response.setFontColor(lecture.getFontColor());
		response.setYear(lecture.getYear());
		response.setSemester(lecture.getSemester());
		response.setClassId(lecture.getClassId());
		response.setTeacherModel(teacherModel);
		response.setSchedule(lecture.getSchedule());
		response.setNotices(lecture.getNotices());
		response.setExams(lecture.getExams());
		response.setHomeworks(lecture.getHomeworks());
		response.setLessons(lecture.getLessons());
		response.setStudentOverviewModel(studentOverviewModel);
		return response;
	}


	public static LectureDetailResponse fromLectureModelForTeacher(LectureModel lecture, TeacherModel teacherModel, TeacherOverviewModel teacherOverviewModel) {
		LectureDetailResponse response = new LectureDetailResponse();
		response.setLectureId(lecture.getLectureId());
		response.setTitle(lecture.getTitle());
		response.setSubject(lecture.getSubject());
		response.setBackgroundColor(lecture.getBackgroundColor());
		response.setFontColor(lecture.getFontColor());
		response.setYear(lecture.getYear());
		response.setSemester(lecture.getSemester());
		response.setClassId(lecture.getClassId());
		response.setTeacherModel(teacherModel);
		response.setSchedule(lecture.getSchedule());
		response.setNotices(lecture.getNotices());
		response.setExams(lecture.getExams());
		response.setHomeworks(lecture.getHomeworks());
		response.setLessons(lecture.getLessons());
		response.setTeacherOverviewModel(teacherOverviewModel);
		return response;
	}
}
