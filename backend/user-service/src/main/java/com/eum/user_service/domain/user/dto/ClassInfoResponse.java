package com.eum.user_service.domain.user.dto;

import com.eum.user_service.domain.user.entity.ClassInfo;
import com.eum.user_service.domain.user.entity.School;
import lombok.Builder;

@Builder
public record ClassInfoResponse(
        Long classId,
        String school,
        Long grade,
        Long classNumber
) {
    public static ClassInfoResponse from(ClassInfo classInfo, School school) {
        return ClassInfoResponse.builder()
                .classId(classInfo.getId())
                .school(school.getName())
                .grade(classInfo.getGrade())
                .classNumber(classInfo.getClassNumber())
                .build();
    }
}
