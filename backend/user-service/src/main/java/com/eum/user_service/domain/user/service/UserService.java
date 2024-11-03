package com.eum.user_service.domain.user.service;

import com.eum.user_service.domain.user.dto.SignInRequest;
import com.eum.user_service.domain.user.dto.SignUpRequest;
import com.eum.user_service.domain.user.dto.TokenResponse;
import com.eum.user_service.domain.user.dto.UserIdRequest;

public interface UserService {

    TokenResponse signUp(SignUpRequest signUpRequest);

    TokenResponse signIn(SignInRequest signInRequest);

    void checkId(UserIdRequest userIdRequest);
}
