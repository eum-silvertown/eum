package com.eum.user_service.domain.mail.dto;

import lombok.Builder;

@Builder
public record EmailAuthCheckRequest(
        String email,
        String code
) {
}
