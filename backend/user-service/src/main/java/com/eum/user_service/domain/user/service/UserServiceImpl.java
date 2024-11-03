package com.eum.user_service.domain.user.service;

import com.eum.user_service.domain.user.dto.SignInRequest;
import com.eum.user_service.domain.user.dto.SignUpRequest;
import com.eum.user_service.domain.user.dto.TokenResponse;
import com.eum.user_service.domain.user.entity.*;
import com.eum.user_service.domain.user.repository.*;
import com.eum.user_service.global.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
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

        // User 엔티티 생성
        Member member = Member.of(signUpRequest, encodedPassword);
        // 데이터베이스에 사용자 정보 저장
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
            throw new RuntimeException();
        }
        return createTokenResponse(member);
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
        refreshTokenRepository.save(RefreshToken.of(refreshToken, member.getId(),jwtUtil.getRefreshExpiration()));

        return TokenResponse.from(accessToken, refreshToken);
    }
}
