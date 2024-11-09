package com.eum.lecture_service.event.event.homework;

import java.util.List;

import com.eum.lecture_service.event.dto.HomeworkProblemSubmissionEventDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HomeworkSubmissionCreateEvent {

	private Long homeworkSubmissionId;
	private Long homeworkId;
	private Long lectureId;
	private Long studentId;
	private Double score;
	private Long correctCount;
	private Long totalCount;
	private List<HomeworkProblemSubmissionEventDto> problemSubmissions;
}
