package com.eum.user_service.domain.mail.controller;

import com.eum.user_service.domain.mail.dto.FindIdRequest;
import com.eum.user_service.domain.mail.service.MailService;
import com.eum.user_service.domain.user.dto.SignUpRequest;
import com.eum.user_service.domain.user.dto.TokenResponse;
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

    @PostMapping("/find/id")
    public CommonResponse<?> findId(@RequestBody FindIdRequest findIdRequest) {
        mailService.findId(findIdRequest);
        return CommonResponse.success("이메일이 전송에 성공 했습니다.");
    }
}
