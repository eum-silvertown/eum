package com.eum.drawingservice.domain.blackboard.entity;

import lombok.Builder;
import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Getter
@Builder
@Document(collection = "drawing_operations")
public class DrawingOperation {

    @Id
    private String id;
    private List<DrawingPoint> points = new ArrayList<>();
    private String classroomId;
    private int snapshotVersion;

    public void snapshotVersionUp() {
        this.snapshotVersion++;
    }

    public void addPoint(List<DrawingPoint> point) {
        this.points.addAll(point);
    }

    public void removeAllPoints() {
        this.points.clear();
    }
}
