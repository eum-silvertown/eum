package com.eum.user_service.domain.token.dto;

import lombok.Builder;

@Builder
public record TokenRequest(
        String refreshToken
) {
}
