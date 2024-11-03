package com.eum.user_service.domain.user.controller;

import com.eum.user_service.domain.user.dto.SignInRequest;
import com.eum.user_service.domain.user.dto.SignUpRequest;
import com.eum.user_service.domain.user.dto.TokenResponse;
import com.eum.user_service.domain.user.dto.UserIdRequest;
import com.eum.user_service.domain.user.service.UserService;
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
    public ResponseEntity<?> signUp(@RequestBody SignUpRequest signUpRequest) {
        log.info("Sign up request: {}", signUpRequest);
        TokenResponse token = userService.signUp(signUpRequest);
        return ResponseEntity.ok(token);
    }

    @PostMapping("/sign-in")
    public ResponseEntity<?> signIn(@RequestBody SignInRequest signInRequest) {
        log.info("Sign In request: {}", signInRequest);
        TokenResponse token = userService.signIn(signInRequest);
        return ResponseEntity.ok(token);
    }

    @PostMapping("/check/id")
    public ResponseEntity<?> checkId(@RequestBody UserIdRequest userIdRequest) {
        log.info("check userId request: {}", userIdRequest);
        userService.checkId(userIdRequest);
        return ResponseEntity.ok(null);
    }
}
