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
    private long expireTime;

    @Builder
    public RefreshToken(String refreshToken, Long userId, long expireTime) {
        this.refreshToken = refreshToken;
        this.userId = userId;
        this.expireTime = expireTime;
    }

    public static RefreshToken of(String refreshToken, Long userId, long expireTime) {
        return RefreshToken.builder()
                .refreshToken(refreshToken)
                .userId(userId)
                .expireTime(expireTime)
                .build();
    }
}
