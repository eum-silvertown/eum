package com.eum.user_service.domain.user.controller;

import com.eum.user_service.domain.file.dto.ImageResponse;
import com.eum.user_service.domain.token.dto.TokenRequest;
import com.eum.user_service.domain.token.dto.TokenResponse;
import com.eum.user_service.domain.user.dto.*;
import com.eum.user_service.domain.user.entity.Role;
import com.eum.user_service.domain.user.service.UserService;
import com.eum.user_service.global.common.CommonResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController implements UserApiDocumentation{

    private final UserService userService;

    @PostMapping("/sign-up")
    public CommonResponse<?> signUp(@RequestBody SignUpRequest signUpRequest) {
        SimpleMemberInfoResponse simpleMemberInfoResponse = userService.signUp(signUpRequest);
        return CommonResponse.success(simpleMemberInfoResponse, "회원가입에 성공했습니다.");
    }

    @PostMapping("/sign-in")
    public CommonResponse<?> signIn(@RequestBody SignInRequest signInRequest) {
        SimpleMemberInfoResponse simpleMemberInfoResponse = userService.signIn(signInRequest);
        return CommonResponse.success(simpleMemberInfoResponse,"로그인에 성공했습니다.");
    }

    @PostMapping("/check/id")
    public CommonResponse<?> checkId(@RequestBody UserIdRequest userIdRequest) {
        userService.checkId(userIdRequest);
        return CommonResponse.success("사용가능한 id입니다.");
    }

    @PostMapping("/access")
    public CommonResponse<?> getToken(@RequestBody TokenRequest tokenRequest) {
        TokenResponse token = userService.generateAccessToken(tokenRequest);
        return CommonResponse.success(token,"토큰 발급에 성공했습니다.");
    }

    @GetMapping("/logout")
    public CommonResponse<?> logout(@RequestHeader(value = "X-MEMBER-ID", required = false) String memberId,
                                    @RequestHeader(value = "Authorization", required = false) String token) {
        userService.logout(Long.valueOf(memberId), token);
        return CommonResponse.success("로그아웃에 성공했습니다.");
    }

    @PatchMapping("/info/password")
    public CommonResponse<?> updateMemberPassword(@RequestHeader(value = "X-MEMBER-ID", required = false) String memberId,
                                                  @RequestBody PasswordUpdateRequest passwordUpdateRequest) {
        userService.updateMemberPassword(Long.valueOf(memberId), passwordUpdateRequest);
        return CommonResponse.success("비밀번호 변경에 성공했습니다.");
    }

    @DeleteMapping("/info")
    public CommonResponse<?> cancelMember(@RequestHeader(value = "X-MEMBER-ID", required = false) String memberId) {
        userService.deleteMemberInfo(Long.valueOf(memberId));
        return CommonResponse.success("성공적으로 탈퇴 되었습니다.");
    }

    @GetMapping("/info")
    public CommonResponse<?> getUserInfo(@RequestHeader(value = "X-MEMBER-ID", required = false) String memberId,
                                         @RequestHeader(value = "X-MEMBER-ROLE", required = false) Role role) {
        MemberInfoResponse userInfoResponse = userService.getMemberInfo(Long.valueOf(memberId), role);
        return CommonResponse.success(userInfoResponse,"유저 정보를 성공적으로 조회했습니다.");
    }

    @PatchMapping("/info/image")
    public CommonResponse<?> updateMemberProfileImage(
            @RequestHeader(value = "X-MEMBER-ID", required = false) String memberId) {
        ImageResponse imageResponse = userService.updateMemberProfile(Long.valueOf(memberId));
        return CommonResponse.success(imageResponse,"프로필 사진이 성공적으로 변경되었습니다.");
    }

    @DeleteMapping("/info/image")
    public CommonResponse<?> deleteMemberProfileImage(
            @RequestHeader(value = "X-MEMBER-ID", required = false) String memberId) {
        userService.deleteMemberImage(Long.valueOf(memberId));
        return CommonResponse.success("프로필 사진이 성공적으로 삭제되었습니다.");
    }
}
