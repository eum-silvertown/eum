package com.eum.user_service.domain.user.controller;

import com.eum.user_service.domain.user.dto.*;
import com.eum.user_service.domain.user.service.UserService;
import com.eum.user_service.global.common.CommonResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    @PostMapping("/sign-up")
    public CommonResponse<?> signUp(@RequestBody SignUpRequest signUpRequest) {
        log.info("Sign up request: {}", signUpRequest);
        TokenResponse token = userService.signUp(signUpRequest);
        return CommonResponse.success(token, "회원가입에 성공했습니다.");
    }

    @PostMapping("/sign-in")
    public CommonResponse<?> signIn(@RequestBody SignInRequest signInRequest) {
        log.info("Sign In request: {}", signInRequest);
        TokenResponse token = userService.signIn(signInRequest);
        return CommonResponse.success(token,"로그인에 성공했습니다.");
    }

    @PostMapping("/check/id")
    public CommonResponse<?> checkId(@RequestBody UserIdRequest userIdRequest) {
        log.info("check userId request: {}", userIdRequest);
        userService.checkId(userIdRequest);
        return CommonResponse.success("사용가능한 id입니다.");
    }

    @PostMapping("/access")
    public CommonResponse<?> getToken(@RequestBody TokenRequest tokenRequest) {
        log.info("generate access token request: {}", tokenRequest);
        TokenResponse token = userService.generateAccessToken(tokenRequest);
        return CommonResponse.success(token,"토큰 발급에 성공했습니다.");
    }
}
