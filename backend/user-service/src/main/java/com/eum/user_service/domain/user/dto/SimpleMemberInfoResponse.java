package com.eum.user_service.domain.user.dto;

import com.eum.user_service.domain.file.dto.ImageResponse;
import com.eum.user_service.domain.token.dto.TokenResponse;
import com.eum.user_service.domain.user.entity.Member;
import lombok.Builder;

@Builder
public record SimpleMemberInfoResponse(
        String name,
        ImageResponse imageResponse,
        TokenResponse tokenResponse
) {
    public static SimpleMemberInfoResponse from(Member member, ImageResponse imageResponse, TokenResponse tokenResponse) {
        return SimpleMemberInfoResponse.builder()
                .name(member.getName())
                .imageResponse(imageResponse)
                .tokenResponse(tokenResponse)
                .build();
    }
}
