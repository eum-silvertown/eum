package com.eum.user_service.domain.token.dto;

import com.eum.user_service.domain.user.entity.Role;
import lombok.Builder;

@Builder
public record TokenResponse(
        String accessToken,
        String refreshToken,
        Role role
) {
    public static TokenResponse from(String accessToken, String refreshToken, Role role) {
        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .role(role)
                .build();
    }
}