package com.eum.user_service.domain.mail.controller;

import com.eum.user_service.domain.mail.dto.EmailAuthCheckRequest;
import com.eum.user_service.domain.mail.dto.EmailAuthRequest;
import com.eum.user_service.domain.mail.dto.FindIdResponse;
import com.eum.user_service.domain.mail.dto.FindPasswordRequest;
import com.eum.user_service.domain.mail.service.MailService;
import com.eum.user_service.global.common.CommonResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/mail")
public class MailController {

    private final MailService mailService;

    @PostMapping("/auth/request")
    public CommonResponse<?> requestEmailAuthentication(@RequestBody EmailAuthRequest emailAuthRequest) {
        mailService.emailAuthentication(emailAuthRequest);
        return CommonResponse.success("인증 코드 전송에 성공 했습니다.");
    }

    @PostMapping("/auth/request/find-id")
    public CommonResponse<?> requestEmailAuthenticationForFindId(@RequestBody EmailAuthRequest emailAuthRequest) {
        mailService.emailAuthenticationForFindId(emailAuthRequest);
        return CommonResponse.success("인증 코드 전송에 성공 했습니다.");
    }

    @PostMapping("/auth/request/find-password")
    public CommonResponse<?> requestEmailAuthenticationForFindPassword(
            @RequestBody FindPasswordRequest findPasswordRequest
    ) {
        mailService.emailAuthenticationForFindPassword(findPasswordRequest);
        return CommonResponse.success("인증 코드 전송에 성공 했습니다.");
    }

    @PostMapping("/auth/verify")
    public CommonResponse<?> emailAuthenticationCheck(@RequestBody EmailAuthCheckRequest emailAuthCheckRequest) {
        mailService.checkAuthenticationCode(emailAuthCheckRequest);
        return CommonResponse.success("인증에 성공 했습니다.");
    }

    @PostMapping("/auth/find-id")
    public CommonResponse<?> findId(@RequestBody EmailAuthCheckRequest emailAuthCheckRequest) {
        FindIdResponse findIdResponse = mailService.findIdWithAuthentication(emailAuthCheckRequest);
        return CommonResponse.success(findIdResponse,"ID 찾기에 성공 했습니다.");
    }

    @PostMapping("/auth/find-password")
    public CommonResponse<?> findPassword(@RequestBody EmailAuthCheckRequest emailAuthCheckRequest) {
        mailService.findPasswordWithAuthentication(emailAuthCheckRequest);
        return CommonResponse.success("임시 비밀번호가 발급되었습니다.");
    }
}
