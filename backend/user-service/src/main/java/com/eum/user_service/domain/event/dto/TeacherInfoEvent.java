package com.eum.user_service.domain.event.dto;

import com.eum.user_service.domain.file.dto.ImageResponse;
import com.eum.user_service.domain.user.entity.Member;
import lombok.Builder;

@Builder
public record TeacherInfoEvent(
        Long teacherId,
        String name,
        String email,
        String tel,
        String image
) {
    public static TeacherInfoEvent from(Member member) {
        return TeacherInfoEvent.builder()
                .teacherId(member.getId())
                .name(member.getName())
                .email(member.getEmail())
                .tel(member.getTel())
                .image(member.getImage())
                .build();
    }

    public static TeacherInfoEvent from(Member member, ImageResponse imageResponse) {
        return TeacherInfoEvent.builder()
                .teacherId(member.getId())
                .image(imageResponse.url())
                .build();
    }
}
