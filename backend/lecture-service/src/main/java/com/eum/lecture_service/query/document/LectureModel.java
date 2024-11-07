package com.eum.lecture_service.query.document;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.eum.lecture_service.query.document.lectureInfo.ExamInfo;
import com.eum.lecture_service.query.document.lectureInfo.HomeworkInfo;
import com.eum.lecture_service.query.document.lectureInfo.LessonInfo;
import com.eum.lecture_service.query.document.lectureInfo.NoticeInfo;
import com.eum.lecture_service.query.document.lectureInfo.ScheduleInfo;

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
@Document(collection = "lectures")
public class LectureModel {

	@Id
	private Long lectureId;
	private String title;
	private String subject;
	private String backgroundColor;
	private String fontColor;
	private Long year;
	private Long semester;
	private Long classId;
	private Long teacherId;
	private List<ScheduleInfo> schedule = new ArrayList<>();
	private List<NoticeInfo> notices = new ArrayList<>();
	private List<ExamInfo> exams = new ArrayList<>();
	private List<HomeworkInfo> homeworks = new ArrayList<>();
	private List<LessonInfo> lessons = new ArrayList<>();
	private StudentOverviewModel studentOverviewModel;
	private TeacherOverviewModel teacherOverviewModel;

}
