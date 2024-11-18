package com.eum.user_service.domain.file.dto;

import lombok.Builder;

@Builder
public record ImageRequest(
        String image
) {
}
