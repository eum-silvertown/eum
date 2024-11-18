package com.eum.user_service.domain.mail.controller;

import com.eum.user_service.domain.mail.dto.EmailAuthCheckRequest;
import com.eum.user_service.domain.mail.dto.EmailAuthRequest;
import com.eum.user_service.domain.mail.dto.FindPasswordRequest;
import com.eum.user_service.global.common.CommonResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Mail", description = "mail 관련 API")
public interface MailApiDocumentation {

    @Operation(summary = "이메일 인증 요청", description = "사용자에게 이메일 인증 코드를 전송합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "인증 코드 전송 성공"),
            @ApiResponse(responseCode = "400", description = "이미 등록된 이메일 입니다."),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    CommonResponse<?> requestEmailAuthentication(EmailAuthRequest emailAuthRequest);

    @Operation(summary = "아이디 찾기를 위한 이메일 인증 요청", description = "아이디 찾기를 위한 인증 코드를 전송합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "인증 코드 전송 성공"),
            @ApiResponse(responseCode = "404", description = "사용자를 찾을 수 없습니다."),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    CommonResponse<?> requestEmailAuthenticationForFindId(EmailAuthRequest emailAuthRequest);

    @Operation(summary = "비밀번호 찾기를 위한 이메일 인증 요청", description = "비밀번호 찾기를 위한 인증 코드를 전송합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "인증 코드 전송 성공"),
            @ApiResponse(responseCode = "404", description = "사용자를 찾을 수 없습니다."),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    CommonResponse<?> requestEmailAuthenticationForFindPassword(FindPasswordRequest findPasswordRequest);

    @Operation(summary = "이메일 인증 코드 검증", description = "이메일로 전송된 인증 코드를 검증합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "인증 성공"),
            @ApiResponse(responseCode = "400", description = "만료된 인증 코드입니다, 잘못된 인증 코드입니다"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    CommonResponse<?> emailAuthenticationCheck(EmailAuthCheckRequest emailAuthCheckRequest);

    @Operation(summary = "아이디 찾기", description = "인증을 통해 사용자의 아이디를 찾습니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "아이디 찾기 성공"),
            @ApiResponse(responseCode = "404", description = "사용자를 찾을 수 없습니다."),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    CommonResponse<?> findId(EmailAuthCheckRequest emailAuthCheckRequest);

    @Operation(summary = "비밀번호 찾기", description = "인증을 통해 사용자의 임시 비밀번호를 발급합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "임시 비밀번호 발급 성공"),
            @ApiResponse(responseCode = "404", description = "사용자를 찾을 수 없습니다."),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    CommonResponse<?> findPassword(EmailAuthCheckRequest emailAuthCheckRequest);
}

