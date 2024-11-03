package com.eum.user_service.domain.user.entity;

import com.eum.user_service.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor
@Table(name = "members_class")
public class MembersClass extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "class_info_id", nullable = false)
    private ClassInfo classInfo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Builder
    public MembersClass(ClassInfo classInfo, Member member) {
        this.classInfo = classInfo;
        this.member = member;
    }

    public static MembersClass of(ClassInfo classInfo, Member member) {
        return MembersClass.builder()
                .classInfo(classInfo)
                .member(member)
                .build();
    }
}