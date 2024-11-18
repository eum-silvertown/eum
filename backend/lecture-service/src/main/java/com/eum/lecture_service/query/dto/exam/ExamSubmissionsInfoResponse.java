package com.eum.lecture_service.query.dto.exam;

import java.util.List;
import java.util.stream.Collectors;

import com.eum.lecture_service.query.document.eventModel.StudentModel;
import com.eum.lecture_service.query.document.studentInfo.ExamSubmissionInfo;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ExamSubmissionsInfoResponse {

	private Long examSubmissionId;
	private Long examId;
	private Long studentId;
	private String studentName;
	private String studentImage;
	private Double score;
	private Long correctCount;
	private Long totalCount;
	private Boolean isCompleted;
	private List<ExamProblemSubmissionInfoResponse> problemSubmissions;

	public static ExamSubmissionsInfoResponse fromExamSubmission(ExamSubmissionInfo examSubmissionInfo, StudentModel student) {
		return ExamSubmissionsInfoResponse.builder()
			.examSubmissionId(examSubmissionInfo.getExamSubmissionId())
			.examId(examSubmissionInfo.getExamId())
			.score(examSubmissionInfo.getScore())
			.studentId(student.getStudentId())
			.studentName(student.getName())
			.studentImage(student.getImage())
			.correctCount(examSubmissionInfo.getCorrectCount())
			.totalCount(examSubmissionInfo.getTotalCount())
			.isCompleted(examSubmissionInfo.getIsCompleted())
			.problemSubmissions(
				examSubmissionInfo.getProblemSubmissions().stream()
					.map(ExamProblemSubmissionInfoResponse::fromExamProblemSubmission)
					.collect(Collectors.toList())
			)
			.build();
	}
}
