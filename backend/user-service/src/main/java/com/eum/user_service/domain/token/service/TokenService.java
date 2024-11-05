package com.eum.user_service.domain.token.service;

import com.eum.user_service.domain.token.dto.TokenRequest;
import com.eum.user_service.domain.token.dto.TokenResponse;
import com.eum.user_service.domain.user.entity.Member;
import com.eum.user_service.domain.token.entity.RefreshToken;

public interface TokenService {

    TokenResponse createTokenResponse(Member member);
    RefreshToken validateRefreshToken(TokenRequest tokenRequest);
    void updateRefreshTokenToBlacklist(RefreshToken refreshToken);
}
