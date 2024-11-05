package com.eum.user_service.domain.token.entity;

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

    @Builder
    public RefreshToken(String refreshToken, Long userId, Long expireTime) {
        this.refreshToken = refreshToken;
        this.userId = userId;
        this.expireTime = expireTime;
    }

    public static RefreshToken of(String refreshToken, Long userId, Long expireTime) {
        return RefreshToken.builder()
                .refreshToken(refreshToken)
                .userId(userId)
                .expireTime(expireTime)
                .build();
    }

}
