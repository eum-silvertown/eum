package com.eum.user_service.domain.user.service;

import com.eum.user_service.domain.token.dto.TokenRequest;
import com.eum.user_service.domain.token.dto.TokenResponse;
import com.eum.user_service.domain.user.dto.*;

public interface UserService {

    TokenResponse signUp(SignUpRequest signUpRequest);

    TokenResponse signIn(SignInRequest signInRequest);

    void checkId(UserIdRequest userIdRequest);

    TokenResponse generateAccessToken(TokenRequest tokenRequest);

    void logout(Long memberId, String token);

    void updateMemberPassword(Long memberId, PasswordUpdateRequest passwordUpdateRequest);
}
