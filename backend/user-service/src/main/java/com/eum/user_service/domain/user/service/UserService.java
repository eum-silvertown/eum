package com.eum.user_service.domain.user.service;

import com.eum.user_service.domain.file.dto.ImageResponse;
import com.eum.user_service.domain.token.dto.TokenRequest;
import com.eum.user_service.domain.token.dto.TokenResponse;
import com.eum.user_service.domain.user.dto.*;
import com.eum.user_service.domain.user.entity.Role;

public interface UserService {

    TokenResponse signUp(SignUpRequest signUpRequest);

    TokenResponse signIn(SignInRequest signInRequest);

    void checkId(UserIdRequest userIdRequest);

    TokenResponse generateAccessToken(TokenRequest tokenRequest);

    void logout(Long memberId, String token);

    void updateMemberPassword(Long memberId, PasswordUpdateRequest passwordUpdateRequest);

    void deleteMemberInfo(Long memberId);

    ImageResponse updateMemberProfile(Long memberId);

    MemberInfoResponse getMemberInfo(Long memberId, Role role);
}
