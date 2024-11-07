package com.eum.user_service.domain.user.dto;

import com.eum.user_service.domain.file.dto.ImageResponse;
import com.eum.user_service.domain.user.entity.Member;
import com.eum.user_service.domain.user.entity.Role;
import lombok.Builder;

import java.time.LocalDate;

@Builder
public record MemberInfoResponse(
        Long id,
        String name,
        Role role,
        ClassInfoResponse classInfo,
        LocalDate birth,
        ImageResponse image
) {
    public static MemberInfoResponse from(Member member,
                                          ClassInfoResponse classInfoResponse,
                                          ImageResponse imageResponse) {
        return MemberInfoResponse.builder()
                .id(member.getId())
                .name(member.getName())
                .role(member.getRole())
                .birth(member.getBirth())
                .classInfo(classInfoResponse)
                .image(imageResponse)
                .build();
    }
}
