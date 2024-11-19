package com.eum.user_service.domain.mail.dto;

import com.eum.user_service.domain.user.entity.Member;
import lombok.Builder;

@Builder
public record FindIdResponse(
        String id
) {
    public static FindIdResponse from(Member member) {
        return FindIdResponse.builder()
                .id(member.getUserId())
                .build();
    }
}
