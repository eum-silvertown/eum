package com.eum.lecture_service.command.dto.exam;

import java.time.LocalDateTime;
import java.util.List;

import com.eum.lecture_service.command.entity.exam.Exam;
import com.eum.lecture_service.command.entity.lecture.Lecture;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExamDto {

	private Long examId;
	private Long lectureId;
	private String title;
	private LocalDateTime startTime;
	private LocalDateTime endTime;
	private List<Long> questionIds;

	public Exam toExamEntity(Lecture lecture) {
		return Exam.builder()
			.lecture(lecture)
			.title(title)
			.startTime(startTime)
			.endTime(endTime)
			.build();
	}
}
