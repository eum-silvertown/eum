package com.eum.user_service.domain.token.service;

import com.eum.user_service.domain.token.dto.TokenRequest;
import com.eum.user_service.domain.token.dto.TokenResponse;
import com.eum.user_service.domain.user.entity.Member;
import com.eum.user_service.domain.token.entity.RefreshToken;
import com.eum.user_service.domain.user.repository.RefreshTokenRepository;
import com.eum.user_service.global.exception.ErrorCode;
import com.eum.user_service.global.exception.EumException;
import com.eum.user_service.global.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TokenServiceImpl implements TokenService {

    private final JwtUtil jwtUtil;
    private final RefreshTokenRepository refreshTokenRepository;

    @Override
    public TokenResponse createTokenResponse(Member member) {
        // JWT 토큰 생성
        String accessToken = jwtUtil.createAccessToken(member);
        String refreshToken = jwtUtil.createRefreshToken(member);
        refreshTokenRepository.save(
                RefreshToken.of(refreshToken, member.getId(),jwtUtil.getRefreshExpiration()));

        return TokenResponse.from(accessToken, refreshToken);
    }

    @Override
    public RefreshToken validateRefreshToken(TokenRequest tokenRequest) {
        if(!jwtUtil.isValidRefreshToken(tokenRequest.refreshToken())) {
            throw new EumException(ErrorCode.INVALID_JWT_TOKEN);
        }
        RefreshToken refreshToken = refreshTokenRepository.findById(tokenRequest.refreshToken())
                .orElseThrow(() -> new EumException(ErrorCode.REFRESH_TOKEN_EXPIRED));

        if (refreshToken.getIsBlacklisted()) {
            throw new EumException(ErrorCode.REFRESH_TOKEN_BLACKLISTED);
        }
        return refreshToken;
    }

    @Override
    public void updateRefreshTokenToBlacklist(RefreshToken refreshToken) {

    }
}
