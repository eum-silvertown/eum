package com.eum.lecture_service.command.dto.homework;

import java.time.LocalDateTime;
import java.util.List;

import com.eum.lecture_service.command.entity.homework.Homework;
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
public class HomeworkDto {

	private Long homeworkId;
	private Long lectureId;
	private String title;
	private LocalDateTime startTime;
	private LocalDateTime endTime;
	private List<Long> questionIds;

	public Homework toHomeworkEntity(Lecture lecture) {
		return Homework.builder()
			.lecture(lecture)
			.title(title)
			.startTime(startTime)
			.endTime(endTime)
			.build();
	}

}
