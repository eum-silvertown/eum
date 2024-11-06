package com.eum.lecture_service.command.dto.lecture;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LectureScheduleDto {
    private String day;
    private Long period;
}