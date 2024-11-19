package com.eum.drawingservice.domain.blackboard.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Builder
@Document(collection = "snapshots")
public class SnapShot {

    @Id
    private String id;
    @Setter
    private String imageData;
    private String classroomId;
    private int version;
    private long timestamp;

    public void versionUp() {
        this.version++;
    }
}
