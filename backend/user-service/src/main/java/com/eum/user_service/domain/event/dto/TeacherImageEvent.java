package com.eum.user_service.domain.event.dto;

import com.eum.user_service.domain.file.dto.ImageResponse;
import com.eum.user_service.domain.user.entity.Member;
import lombok.Builder;

@Builder
public record TeacherImageEvent(
        Long teacherId,
        String image
) {

    public static TeacherImageEvent from(Member member, ImageResponse imageResponse) {
        return TeacherImageEvent.builder()
                .teacherId(member.getId())
                .image(imageResponse.url())
                .build();
    }
}
