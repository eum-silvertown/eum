package com.eum.drawingservice.domain.blackboard.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SnapShotRequestDTO {
    private String imageData;
    private int classroomId;
    private long timestamp;
}
