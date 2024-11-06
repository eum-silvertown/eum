package com.eum.lecture_service.query.document;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Document(collection = "lectures")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lecture {

	@Id
	private Long lectureId;

	private String title;
	private String introduction;
	private String subject;
	private String backgroundColor;
	private String fontColor;
	private Long year;
	private Long semester;
	private Long grade;
	private Long classNumber;
	private Teacher teacher;
	private List<Schedule> schedule;
	private List<Notice> notices;
	private List<Exam> exams;
	private List<Replay> replays;
	private List<Homework> homeworks;

	private Overview overview; // 수업 개요 (숙제 수, 시험 수 등)
	private StudentScores studentScores; // 학생 개인의 성적 정보

	// 선생님용 데이터
	private List<StudentInfo> students; // 학생 목록
	private ClassAverageScores classAverageScores; // 클래스 평균 점수
}
