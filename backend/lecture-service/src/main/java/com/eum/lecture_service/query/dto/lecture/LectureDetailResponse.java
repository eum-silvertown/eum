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

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Builder
public class LectureDetailResponse {

	private Long lectureId;
	private String title;
	private String subject;
	private String introduction;
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
		return LectureDetailResponse.builder()
			.lectureId(lecture.getLectureId())
			.title(lecture.getTitle())
			.subject(lecture.getSubject())
			.introduction(lecture.getIntroduction())
			.backgroundColor(lecture.getBackgroundColor())
			.fontColor(lecture.getFontColor())
			.year(lecture.getYear())
			.semester(lecture.getSemester())
			.classId(lecture.getClassId())
			.teacherModel(teacherModel)
			.schedule(lecture.getSchedule())
			.notices(lecture.getNotices())
			.exams(lecture.getExams())
			.homeworks(lecture.getHomeworks())
			.lessons(lecture.getLessons())
			.studentOverviewModel(studentOverviewModel)
			.build();
	}

	public static LectureDetailResponse fromLectureModelForTeacher(LectureModel lecture, TeacherModel teacherModel, TeacherOverviewModel teacherOverviewModel) {
		return LectureDetailResponse.builder()
			.lectureId(lecture.getLectureId())
			.title(lecture.getTitle())
			.subject(lecture.getSubject())
			.introduction(lecture.getIntroduction())
			.backgroundColor(lecture.getBackgroundColor())
			.fontColor(lecture.getFontColor())
			.year(lecture.getYear())
			.semester(lecture.getSemester())
			.classId(lecture.getClassId())
			.teacherModel(teacherModel)
			.schedule(lecture.getSchedule())
			.notices(lecture.getNotices())
			.exams(lecture.getExams())
			.homeworks(lecture.getHomeworks())
			.lessons(lecture.getLessons())
			.teacherOverviewModel(teacherOverviewModel)
			.build();
	}
}
