package com.eum.user_service.global.util;

import com.eum.user_service.domain.user.entity.Member;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
@Getter
public class JwtUtil {
    private final SecretKey secretKey;

    @Value("${jwt.access-token.expire-time}")
    private Long accessExpiration;

    @Value("${jwt.refresh-token.expire-time}")
    private Long refreshExpiration;

    public JwtUtil(@Value("${jwt.secret}") String secret) {
        this.secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8),
                Jwts.SIG.HS256.key().build().getAlgorithm());
    }

    public String createAccessToken(Member member) {
        return Jwts.builder()
                .claim("userId", member.getId())
                .claim("role",member.getRole())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + accessExpiration))
                .signWith(secretKey)
                .compact();
    }

    public String createRefreshToken(Member member) {
        return Jwts.builder()
                .claim("userId", member.getId())
                .claim("role",member.getRole())
                .expiration(new Date(System.currentTimeMillis() + refreshExpiration))
                .signWith(secretKey)
                .compact();
    }

    public Claims getClaimsToken(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
