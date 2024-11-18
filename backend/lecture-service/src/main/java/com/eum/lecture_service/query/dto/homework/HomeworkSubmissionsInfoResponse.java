package com.eum.lecture_service.query.dto.homework;

import java.util.List;
import java.util.stream.Collectors;

import com.eum.lecture_service.query.document.eventModel.StudentModel;
import com.eum.lecture_service.query.document.studentInfo.HomeworkProblemSubmissionInfo;
import com.eum.lecture_service.query.document.studentInfo.HomeworkSubmissionInfo;
import com.eum.lecture_service.query.document.teacherInfo.StudentInfo;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;

@Data
@Builder
public class HomeworkSubmissionsInfoResponse {

	private Long homeworkSubmissionId;
	private Long homeworkId;
	private Long studentId;
	private String studentName;
	private String studentImage;
	private Double score;
	private Long correctCount;
	private Long totalCount;
	private Boolean isCompleted;
	private List<HomeworkProblemSubmissionInfoResponse> problemSubmissions;

	public static HomeworkSubmissionsInfoResponse fromHomeworkSubmission(HomeworkSubmissionInfo homeworkSubmission, StudentModel student) {
		return HomeworkSubmissionsInfoResponse.builder()
			.homeworkSubmissionId(homeworkSubmission.getHomeworkSubmissionId())
			.homeworkId(homeworkSubmission.getHomeworkId())
			.score(homeworkSubmission.getScore())
			.studentName(student.getName())
			.studentImage(student.getImage())
			.studentId(student.getStudentId())
			.isCompleted(homeworkSubmission.getIsComplete())
			.correctCount(homeworkSubmission.getCorrectCount())
			.totalCount(homeworkSubmission.getTotalCount())
			.problemSubmissions(
				homeworkSubmission.getProblemSubmissions().stream()
					.map(HomeworkProblemSubmissionInfoResponse::fromHomeworkProblemSubmission)
					.collect(Collectors.toList())
			)
			.build();
	}
}

