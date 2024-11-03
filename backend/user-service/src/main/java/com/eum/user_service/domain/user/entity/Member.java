package com.eum.user_service.domain.user.entity;

import com.eum.user_service.global.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;

import java.time.Instant;
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
    private String role;

    @Column(name = "birth", nullable = false)
    private Instant birth;

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

    @OneToMany(mappedBy = "member")
    private Set<RefreshToken> refreshTokens = new LinkedHashSet<>();

}