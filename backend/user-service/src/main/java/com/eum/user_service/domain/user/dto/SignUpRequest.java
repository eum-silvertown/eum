package com.eum.user_service.domain.user.dto;

import com.eum.user_service.domain.user.entity.Role;
import lombok.Builder;
import lombok.ToString;

import java.time.LocalDate;

@Builder
public record SignUpRequest(
        String id,
        String password,
        String name,
        String email,
        LocalDate birth,
        String tel,
        String schoolName,
        Long grade,
        Long classNumber,
        Role role // 역할 필드 추가

) {
}
