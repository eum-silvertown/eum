package com.eum.user_service.domain.user.entity;

import com.eum.user_service.domain.user.dto.SignUpRequest;
import com.eum.user_service.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Getter
@Entity
@NoArgsConstructor
@Table(name = "members")
public class Member extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "role", nullable = false)
    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "birth", nullable = false)
    private LocalDate birth;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "tel", nullable = false)
    private String tel;

    @Column(name = "image")
    private String image;

    @OneToMany(mappedBy = "teacher")
    private final List<ClassInfo> classInfos = new ArrayList<>();

    @OneToMany(mappedBy = "member")
    private final List<MembersClass> membersClasses = new ArrayList<>();

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

    public void updatePassword(String password) {
        this.password = password;
    }

    public static Member of(SignUpRequest signUpRequest, String encodedPassword) {
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

    public void updateUserImage(String image) {
        this.image = image;
    }
}