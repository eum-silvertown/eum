package com.eum.user_service.domain.user.dto;

import lombok.Builder;

@Builder
public record PasswordUpdateRequest(
        String password
) {
}
