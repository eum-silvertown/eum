package com.eum.user_service.domain.user.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;

@Getter
@NoArgsConstructor
@RedisHash(value = "refreshToken")
public class RefreshToken {

    @Id
    private String refreshToken;

    private Long userId;

    @TimeToLive
    private Long expireTime;

    private Boolean isBlacklisted; // 블랙리스트 여부를 저장하는 필드

    @Builder
    public RefreshToken(String refreshToken, Long userId, Long expireTime, Boolean isBlacklisted) {
        this.refreshToken = refreshToken;
        this.userId = userId;
        this.expireTime = expireTime;
        this.isBlacklisted = isBlacklisted;
    }

    public static RefreshToken of(String refreshToken, Long userId, Long expireTime, Boolean isBlacklisted) {
        return RefreshToken.builder()
                .refreshToken(refreshToken)
                .userId(userId)
                .expireTime(expireTime)
                .isBlacklisted(isBlacklisted)
                .build();
    }

    public void updateToBlacklist() {
        this.isBlacklisted = true;
    }
}
