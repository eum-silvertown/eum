package com.eum.drawingservice.domain.lesson.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StudentInfoDTO {
    private String type;
    private Long studentId;
    private String studentName;
    private String studentImage;
    private int currentPage;
}
