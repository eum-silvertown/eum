package com.eum.drawingservice.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DrawingRequestDTO {
    private Long memberId;
    private Long lessonId;
    private Long questionId;
    private String drawingData;
}
