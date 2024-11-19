package com.eum.user_service.domain.event.dto;

import com.eum.user_service.domain.file.dto.ImageResponse;
import com.eum.user_service.domain.user.entity.Member;
import lombok.Builder;

@Builder
public record StudentImageEvent(
        Long studentId,
        String image
) {

    public static StudentImageEvent from(Member member, ImageResponse imageResponse) {
        return StudentImageEvent.builder()
                .studentId(member.getId())
                .image(imageResponse.url())
                .build();
    }
}
