package com.eum.user_service.domain.token.dto;

import lombok.Builder;

@Builder
public record TokenResponse(
        String accessToken,
        String refreshToken
) {
    public static TokenResponse from(String accessToken, String refreshToken) {
        return TokenResponse.builder().accessToken(accessToken).refreshToken(refreshToken).build();
    }
}