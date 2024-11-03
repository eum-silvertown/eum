package com.eum.user_service.domain.user.entity;

import com.eum.user_service.domain.user.dto.SignUpRequest;
import com.eum.user_service.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Entity
@Table(name = "members")
public class Member extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "user_id", nullable = false, length = 30)
    private String userId;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "name", nullable = false, length = 30)
    private String name;

    @Column(name = "role", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "birth", nullable = false)
    private LocalDate birth;

    @Column(name = "email", nullable = false, length = 30)
    private String email;

    @Column(name = "tel", nullable = false, length = 11)
    private String tel;

    @Column(name = "image")
    private String image;

    @OneToMany(mappedBy = "teacher")
    private Set<ClassInfo> classInfos = new LinkedHashSet<>();

    @OneToMany(mappedBy = "member")
    private Set<MembersClass> membersClasses = new LinkedHashSet<>();

    @Builder
    public Member(String userId, String password, String name, Role role, LocalDate birth, String email, String tel) {
        this.userId = userId;
        this.password = password;
        this.name = name;
        this.role = role;
        this.birth = birth;
        this.email = email;
        this.tel = tel;
    }

    public static Member from(SignUpRequest signUpRequest, String encodedPassword) {
        return Member.builder()
                .userId(signUpRequest.id())
                .password(encodedPassword)
                .name(signUpRequest.name())
                .role(signUpRequest.role())
                .email(signUpRequest.email())
                .tel(signUpRequest.tel())
                .birth(signUpRequest.birth())
                .build();
    }
}