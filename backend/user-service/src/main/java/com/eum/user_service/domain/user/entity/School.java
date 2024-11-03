package com.eum.user_service.domain.user.entity;

import com.eum.user_service.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Entity
@NoArgsConstructor
@Table(name = "school")
public class School extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "name", nullable = false, length = 50)
    private String name;

    @OneToMany(mappedBy = "school")
    private Set<ClassInfo> classInfos = new LinkedHashSet<>();

    @Builder
    public School(String name) {
        this.name = name;
    }

    public static School of(String name) {
        return School.builder().name(name).build();
    }
}