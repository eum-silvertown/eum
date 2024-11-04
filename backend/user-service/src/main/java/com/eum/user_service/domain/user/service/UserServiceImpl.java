package com.eum.user_service.domain.user.service;

import com.eum.user_service.domain.user.dto.*;
import com.eum.user_service.domain.user.entity.*;
import com.eum.user_service.domain.user.repository.*;
import com.eum.user_service.global.exception.ErrorCode;
import com.eum.user_service.global.exception.EumException;
import com.eum.user_service.global.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ClassInfoRepository classInfoRepository;
    private final SchoolRepository schoolRepository;
    private final MemberClassRepository memberClassRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    @Transactional
    public TokenResponse signUp(SignUpRequest signUpRequest){
        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(signUpRequest.password());

        // School 엔티티 중복 확인 및 생성
        School school = schoolRepository.findByName(signUpRequest.schoolName())
                .orElseGet(() -> schoolRepository.save(School.of(signUpRequest.schoolName())));

        // 데이터베이스에 사용자 정보 저장
        userRepository.findByUserId(signUpRequest.id())
                .ifPresent(member -> {
                    throw new EumException(ErrorCode.USER_ID_ALREADY_EXISTED);
                });

        // User 엔티티 생성
        Member member = Member.of(signUpRequest, encodedPassword);
        userRepository.save(member);
        //ClassInfo 엔티티 생성
        ClassInfo classInfo = getClassInfo(signUpRequest, school);

        if (signUpRequest.role() == Role.STUDENT) {
            // STUDENT 역할에 대한 추가 처리 로직
            memberClassRepository.save(MembersClass.of(classInfo,member));
        } else {
            // TEACHER 역할에 대한 추가 처리 로직
            if (classInfo.getTeacher() != null) {
                //다른 반 선택 에러처리
                throw new EumException(ErrorCode.CLASS_TEACHER_ALREADY_EXISTED);
            }
            classInfo.updateTeacher(member);
        }

        return createTokenResponse(member);
    }

    @Override
    public TokenResponse signIn(SignInRequest signInRequest) {
        Member member = userRepository.findByUserId(signInRequest.userId())
                .orElseThrow(RuntimeException::new);
        if(!passwordEncoder.matches(signInRequest.password(), member.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 틀렸습니다.");
        }
        return createTokenResponse(member);
    }

    @Override
    public void checkId(UserIdRequest userIdRequest) {
        userRepository.findByUserId(userIdRequest.userId())
                .ifPresent(member -> {
                    throw new EumException(ErrorCode.USER_ID_ALREADY_EXISTED);
                });
    }

    @Override
    public TokenResponse generateAccessToken(TokenRequest tokenRequest) {
        RefreshToken refreshToken = validateRefreshToken(tokenRequest);
        // 기존 RefreshToken blacklist 등록
        updateRefreshTokenToBlacklist(refreshToken);

        Member member = userRepository.findById(refreshToken.getUserId())
                .orElseThrow(() -> new EumException(ErrorCode.USER_NOT_FOUND));

        return createTokenResponse(member);
    }

    private void updateRefreshTokenToBlacklist(RefreshToken refreshToken) {
        refreshToken.updateToBlacklist();
        refreshTokenRepository.save(refreshToken);
    }

    private RefreshToken validateRefreshToken(TokenRequest tokenRequest) {
        if(!jwtUtil.isValidRefreshToken(tokenRequest.refreshToken())) {
            throw new EumException(ErrorCode.INVALID_JWT_TOKEN);
        }
        RefreshToken refreshToken = refreshTokenRepository.findById(tokenRequest.refreshToken())
                .orElseThrow(() -> new EumException(ErrorCode.REFRESH_TOKEN_EXPIRED));

        if (refreshToken.getIsBlacklisted()) {
            throw new EumException(ErrorCode.REFRESH_TOKEN_BLACKLISTED);
        }
        return refreshToken;
    }

    private ClassInfo getClassInfo(SignUpRequest signUpRequest, School school) {
        return classInfoRepository
                .findBySchoolAndGradeAndClassNumber(school, signUpRequest.grade(), signUpRequest.classNumber())
                .orElseGet(() -> classInfoRepository
                        .save(ClassInfo.from(school, signUpRequest.grade(), signUpRequest.classNumber())));
    }

    private TokenResponse createTokenResponse(Member member) {
        // JWT 토큰 생성
        String accessToken = jwtUtil.createAccessToken(member);
        String refreshToken = jwtUtil.createRefreshToken(member);
        refreshTokenRepository.save(
                RefreshToken.of(refreshToken, member.getId(),jwtUtil.getRefreshExpiration(),false));

        return TokenResponse.from(accessToken, refreshToken);
    }
}
