package com.eum.lecture_service.event.event.homework;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.eum.lecture_service.command.entity.homework.Homework;

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
public class HomeworkCreateEvent {

	private Long homeworkId;
	private Long lectureId;
	private String title;
	private LocalDateTime startTime;
	private LocalDateTime endTime;
	private List<Long> questionIds;

}
