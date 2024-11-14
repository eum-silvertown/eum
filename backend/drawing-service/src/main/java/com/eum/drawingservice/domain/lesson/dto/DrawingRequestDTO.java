package com.eum.drawingservice.domain.lesson.dto;

import com.eum.drawingservice.domain.lesson.entity.Role;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DrawingRequestDTO {
    private Long memberId;
    private Role role;
    private Long lessonId;
    private Long questionId;
    private String drawingData;
}
