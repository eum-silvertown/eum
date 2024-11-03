package com.eum.user_service.domain.user.service;

import com.eum.user_service.domain.user.dto.SignUpRequest;
import com.eum.user_service.domain.user.dto.TokenResponse;
import com.eum.user_service.domain.user.entity.Member;
import com.eum.user_service.domain.user.entity.School;
import com.eum.user_service.domain.user.repository.SchoolRepository;
import com.eum.user_service.domain.user.repository.UserRepository;
import com.eum.user_service.global.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final SchoolRepository schoolRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    @Transactional
    public TokenResponse signUp(SignUpRequest signUpRequest){
        // 1. 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(signUpRequest.password());

        // 2. User 엔티티 생성
        School school = schoolRepository.save(School.of(signUpRequest.schoolName()));
        Member member = Member.from(signUpRequest, encodedPassword);

        // 3. 데이터베이스에 사용자 정보 저장
        userRepository.save(member);

        // 4. JWT 토큰 생성
        String accessToken = jwtUtil.createAccessToken(member);
        String refreshToken = jwtUtil.createRefreshToken(member);

        return TokenResponse.from(accessToken, refreshToken);
    }
}
