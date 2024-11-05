package com.eum.user_service.domain.user.service;

import com.eum.user_service.domain.token.dto.TokenRequest;
import com.eum.user_service.domain.token.dto.TokenResponse;
import com.eum.user_service.domain.token.entity.RefreshToken;
import com.eum.user_service.domain.token.service.TokenService;
import com.eum.user_service.domain.user.dto.*;
import com.eum.user_service.domain.user.entity.*;
import com.eum.user_service.domain.user.repository.*;
import com.eum.user_service.global.exception.ErrorCode;
import com.eum.user_service.global.exception.EumException;
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
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    @Override
    @Transactional
    public TokenResponse signUp(SignUpRequest signUpRequest){
        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(signUpRequest.password());

        // School 엔티티 중복 확인 및 생성
        School school = schoolRepository.findByName(signUpRequest.schoolName())
                .orElseGet(() -> schoolRepository.save(School.of(signUpRequest.schoolName())));

        // 중복 검사
        checkDuplicateIdAndEmail(signUpRequest);

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

        return tokenService.createTokenResponse(member);
    }

    @Override
    public TokenResponse signIn(SignInRequest signInRequest) {
        Member member = userRepository.findByUserId(signInRequest.id())
                .orElseThrow(() -> new EumException(ErrorCode.USER_NOT_FOUND));
        if(!passwordEncoder.matches(signInRequest.password(), member.getPassword())) {
            throw new EumException(ErrorCode.PASSWORD_NOT_MATCH);
        }
        return tokenService.createTokenResponse(member);
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
        RefreshToken refreshToken = tokenService.validateRefreshToken(tokenRequest);
        // 기존 RefreshToken blacklist 등록
        tokenService.updateRefreshTokenToBlacklist(refreshToken);

        Member member = userRepository.findById(refreshToken.getUserId())
                .orElseThrow(() -> new EumException(ErrorCode.USER_NOT_FOUND));

        return tokenService.createTokenResponse(member);
    }

    private void checkDuplicateIdAndEmail(SignUpRequest signUpRequest) {
        userRepository.findByUserId(signUpRequest.id())
                .ifPresent(member -> {
                    throw new EumException(ErrorCode.USER_ID_ALREADY_EXISTED);
                });
        userRepository.findByEmail(signUpRequest.email())
                .ifPresent(member -> {
                    throw new EumException(ErrorCode.EMAIL_ALREADY_EXISTED);
                });
    }

    private ClassInfo getClassInfo(SignUpRequest signUpRequest, School school) {
        return classInfoRepository
                .findBySchoolAndGradeAndClassNumber(school, signUpRequest.grade(), signUpRequest.classNumber())
                .orElseGet(() -> classInfoRepository
                        .save(ClassInfo.from(school, signUpRequest.grade(), signUpRequest.classNumber())));
    }

}
