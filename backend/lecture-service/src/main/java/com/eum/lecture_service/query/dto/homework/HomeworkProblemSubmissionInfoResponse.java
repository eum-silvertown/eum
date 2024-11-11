package com.eum.lecture_service.query.dto.homework;

import com.eum.lecture_service.query.document.studentInfo.HomeworkProblemSubmissionInfo;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class HomeworkProblemSubmissionInfoResponse {
    private Long homeworkProblemSubmissionId;
    private Long questionId;
    private Boolean isCorrect;
    private String homeworkSolution;

    public static HomeworkProblemSubmissionInfoResponse fromHomeworkProblemSubmission( HomeworkProblemSubmissionInfo homeworkProblemSubmission) {
        return HomeworkProblemSubmissionInfoResponse.builder()
            .homeworkProblemSubmissionId(homeworkProblemSubmission.getHomeworkProblemSubmissionId())
            .questionId(homeworkProblemSubmission.getQuestionId())
            .isCorrect(homeworkProblemSubmission.getIsCorrect())
            .homeworkSolution(homeworkProblemSubmission.getHomeworkSolution())
            .build();
    }
}