package com.eum.user_service.domain.token.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;

@Getter
@NoArgsConstructor
@RedisHash(value = "key")
public class RefreshToken {

    @Id
    private String key;

    private Long userId;

    private String refreshToken;

    @TimeToLive
    private Long expireTime;

    @Builder
    public RefreshToken(String key, String refreshToken, Long userId, Long expireTime) {
        this.key = key;
        this.refreshToken = refreshToken;
        this.userId = userId;
        this.expireTime = expireTime;
    }

    public static RefreshToken of(String refreshToken, Long userId, Long expireTime) {
        return RefreshToken.builder()
                .key("refresh_token" + userId)
                .userId(userId)
                .refreshToken(refreshToken)
                .expireTime(expireTime)
                .build();
    }

}
