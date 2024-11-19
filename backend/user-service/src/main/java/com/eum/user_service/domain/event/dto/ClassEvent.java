package com.eum.user_service.domain.event.dto;

import com.eum.user_service.domain.user.entity.ClassInfo;
import com.eum.user_service.domain.user.entity.School;
import lombok.Builder;

@Builder
public record ClassEvent(
        Long classId,
        Long grade,
        Long classNumber,
        String school
) {
    public static ClassEvent from(ClassInfo classInfo, School school) {
        return ClassEvent.builder()
                .classId(classInfo.getId())
                .grade(classInfo.getGrade())
                .classNumber(classInfo.getClassNumber())
                .school(school.getName())
                .build();
    }
}
