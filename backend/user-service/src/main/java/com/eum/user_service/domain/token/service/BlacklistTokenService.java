package com.eum.user_service.domain.token.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class BlacklistTokenService {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    private static final String BLACKLIST_TOKEN_KEY = "BlacklistTokens";
    // 블랙리스트 토큰 추가
    public void addTokenToBlacklist(String token) {
        redisTemplate.opsForSet().add(BLACKLIST_TOKEN_KEY, token);
    }

    // 블랙리스트 토큰 존재 여부 확인
    public boolean isTokenBlacklisted(String token) {
        return Boolean.TRUE.equals(redisTemplate.opsForSet().isMember(BLACKLIST_TOKEN_KEY, token));
    }

    // 블랙리스트 토큰 삭제
    public void removeTokenFromBlacklist(String token) {
        redisTemplate.opsForSet().remove(BLACKLIST_TOKEN_KEY, token);
    }
}
