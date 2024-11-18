package com.eum.user_service.domain.event.dto;

import com.eum.user_service.domain.user.entity.ClassInfo;
import com.eum.user_service.domain.user.entity.Member;
import lombok.Builder;

@Builder
public record StudentInfoEvent(
        Long studentId,
        String name,
        String image,
        Long classId,
        Long grade,
        Long classNumber
) {
    public static StudentInfoEvent from(Member student, ClassInfo classInfo) {
        return StudentInfoEvent.builder()
                .studentId(student.getId())
                .name(student.getName())
                .image(student.getImage())
                .classId(classInfo.getId())
                .grade(classInfo.getGrade())
                .classNumber(classInfo.getClassNumber())
                .build();
    }

    public static StudentInfoEvent from(Member student) {
        return StudentInfoEvent.builder()
                .studentId(student.getId())
                .image(student.getImage())
                .build();
    }
}
