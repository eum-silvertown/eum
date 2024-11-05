package com.eum.user_service.domain.user.dto;

import com.eum.user_service.domain.user.entity.ClassInfo;
import com.eum.user_service.domain.user.entity.School;
import lombok.Builder;

@Builder
public record ClassInfoResponse(
        String school,
        Long grade,
        Long classNumber
) {
    public static ClassInfoResponse from(ClassInfo classInfo, School school) {
        return ClassInfoResponse.builder()
                .school(school.getName())
                .grade(classInfo.getGrade())
                .classNumber(classInfo.getClassNumber())
                .build();
    }
}
