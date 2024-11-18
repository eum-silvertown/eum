package com.eum.drawingservice.domain.lesson.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Getter
@Document(collection = "drawings")
@Builder
public class Drawing {

    @Id
    private String id;
    private String memberId;
    private String lessonId;
    private String questionId;

    private String width;
    private String height;
    private String ratio;

    @Setter
    private String drawingData;

    @CreatedDate
    private LocalDateTime createdAt;
}
