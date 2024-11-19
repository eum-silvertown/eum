package com.eum.drawingservice.domain.blackboard.entity;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DrawingPoint {
    private double x;
    private double y;
    private String tool;
    private String color;
    private String type;
    private long timestamp;
    private String userId;
    private String lineId;
}
