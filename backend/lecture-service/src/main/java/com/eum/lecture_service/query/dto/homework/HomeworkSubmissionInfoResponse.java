package com.eum.lecture_service.query.dto.homework;

import java.util.List;
import java.util.stream.Collectors;

import com.eum.lecture_service.query.document.studentInfo.HomeworkSubmissionInfo;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class HomeworkSubmissionInfoResponse {
    private Long homeworkSubmissionId;
    private Long homeworkId;
    private Double score;
    private Long correctCount;
    private Long totalCount;
    private List<HomeworkProblemSubmissionInfoResponse> problemSubmissions;

    public static HomeworkSubmissionInfoResponse fromHomeworkSubmission(HomeworkSubmissionInfo homeworkSubmission) {
        return HomeworkSubmissionInfoResponse.builder()
            .homeworkSubmissionId(homeworkSubmission.getHomeworkSubmissionId())
            .homeworkId(homeworkSubmission.getHomeworkId())
            .score(homeworkSubmission.getScore())
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