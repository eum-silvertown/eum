package com.eum.lecture_service.query.dto.homework;

import java.time.LocalDateTime;
import java.util.List;

import com.eum.lecture_service.command.entity.homework.Homework;
import com.eum.lecture_service.query.document.lectureInfo.HomeworkInfo;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class HomeworkInfoResponse {
    private Long homeworkId;
    private String title;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private List<Long> questionIds;

    public static HomeworkInfoResponse fromHomework(HomeworkInfo homework) {
        return HomeworkInfoResponse.builder()
            .homeworkId(homework.getHomeworkId())
            .title(homework.getTitle())
            .startTime(homework.getStartTime())
            .endTime(homework.getEndTime())
            .questionIds(homework.getQuestions())
            .build();
    }
}