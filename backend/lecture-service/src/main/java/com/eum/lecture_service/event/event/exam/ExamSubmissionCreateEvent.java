package com.eum.lecture_service.event.event.exam;

import java.util.List;

import com.eum.lecture_service.event.dto.ExamProblemSubmissionEventDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExamSubmissionCreateEvent {

	private Long examSubmissionId;
	private Long examId;
	private Long lectureId;
	private Long studentId;
	private Double score;
	private Long correctCount;
	private Long totalCount;
	private List<ExamProblemSubmissionEventDto> problemSubmissions;
}
