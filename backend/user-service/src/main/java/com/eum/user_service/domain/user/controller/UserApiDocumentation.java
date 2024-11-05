package com.eum.user_service.domain.user.controller;

import com.eum.user_service.domain.file.dto.ImageRequest;
import com.eum.user_service.domain.token.dto.TokenRequest;
import com.eum.user_service.domain.user.dto.PasswordUpdateRequest;
import com.eum.user_service.domain.user.dto.SignInRequest;
import com.eum.user_service.domain.user.dto.SignUpRequest;
import com.eum.user_service.domain.user.dto.UserIdRequest;
import com.eum.user_service.domain.user.entity.Role;
import com.eum.user_service.global.common.CommonResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "User", description = "user 관련 API")
public interface UserApiDocumentation {

    @Operation(summary = "회원가입", description = "새로운 사용자를 등록합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "회원가입 성공"),
            @ApiResponse(responseCode = "400", description = "이미 선생님이 등록된 반 입니다."),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    CommonResponse<?> signUp(SignUpRequest signUpRequest);

    @Operation(summary = "로그인", description = "사용자가 로그인합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "로그인 성공"),
            @ApiResponse(responseCode = "400", description = "비밀번호가 일치하지 않습니다"),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 유저 입니다"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    CommonResponse<?> signIn(SignInRequest signInRequest);

    @Operation(summary = "아이디 중복 체크", description = "사용 가능한 아이디인지 확인합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "사용가능한 아이디"),
            @ApiResponse(responseCode = "400", description = "이미 존재하는 ID 입니다"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    CommonResponse<?> checkId(UserIdRequest userIdRequest);

    @Operation(summary = "Access 토큰 발급", description = "Access 토큰을 발급합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "토큰 발급 성공"),
            @ApiResponse(responseCode = "401", description = "Refresh Token이 만료되었습니다" +
                    ", 블랙리스트에 등록된 Refresh Token입니다"),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 유저 입니다"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    CommonResponse<?> getToken(TokenRequest tokenRequest);

    @Operation(summary = "로그아웃", description = "사용자가 로그아웃합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "로그아웃 성공"),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 유저 입니다"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    CommonResponse<?> logout(String memberId, String token);

    @Operation(summary = "비밀번호 변경", description = "사용자의 비밀번호를 변경합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "비밀번호 변경 성공"),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 유저 입니다"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    CommonResponse<?> updateMemberPassword(String memberId, PasswordUpdateRequest passwordUpdateRequest);

    @Operation(summary = "회원 탈퇴", description = "사용자가 회원 탈퇴합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "탈퇴 성공"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    CommonResponse<?> cancelMember(String memberId);

    @Operation(summary = "유저 정보 조회", description = "사용자의 정보를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "유저 정보 조회 성공"),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 유저 입니다, 등록되지 않은 반 정보 입니다."),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    CommonResponse<?> getUserInfo(String memberId, Role role);

    @Operation(summary = "프로필 사진 업데이트", description = "사용자의 프로필 사진을 변경합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "프로필 사진 변경 성공"),
            @ApiResponse(responseCode = "404", description = "존재하지 않는 유저 입니다"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    CommonResponse<?> updateMemberProfileImage(String memberId, ImageRequest imageRequest);
}
