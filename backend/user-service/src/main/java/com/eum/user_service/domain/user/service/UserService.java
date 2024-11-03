package com.eum.user_service.domain.user.service;

import com.eum.user_service.domain.user.dto.*;

public interface UserService {

    TokenResponse signUp(SignUpRequest signUpRequest);

    TokenResponse signIn(SignInRequest signInRequest);

    void checkId(UserIdRequest userIdRequest);

    TokenResponse generateAccessToken(TokenRequest tokenRequest);
}
