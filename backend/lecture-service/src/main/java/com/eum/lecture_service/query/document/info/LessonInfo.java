package com.eum.lecture_service.query.document.info;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonInfo {
    private Long lessonId;
    private String title;
    private List<Long> questions;
}