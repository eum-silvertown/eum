package com.eum.lecture_service.query.document.teacherInfo;

import com.eum.lecture_service.query.document.studentInfo.StudentScores;

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
public class StudentInfo {

	private Long studentId;
	private String studentImage;
	private String studentName;
	@Builder.Default
	private StudentScores studentScores = new StudentScores(0.0, 0.0, 100.0);
}
