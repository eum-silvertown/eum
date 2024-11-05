package com.eum.user_service.domain.user.dto;

import com.eum.user_service.domain.file.dto.ImageResponse;
import lombok.Builder;

import java.time.LocalDate;

@Builder
public record MemberInfoResponse(
        Long userId,
        String userName,
        ClassInfoResponse classInfo,
        LocalDate birth,
        ImageResponse image
) {
}
