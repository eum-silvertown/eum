package com.eum.drawingservice.domain.blackboard.dto;

import com.eum.drawingservice.domain.blackboard.entity.DrawingOperation;
import com.eum.drawingservice.domain.blackboard.entity.SnapShot;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SnapShotResponseDTO {
    private SnapShot snapShot;
    private DrawingOperation drawingOperation;
}
