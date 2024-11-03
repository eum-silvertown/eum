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
@Table(name = "class_info")
public class ClassInfo extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "school_id", nullable = false)
    private School school;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id")
    private Member teacher;

    @Column(name = "grade", nullable = false)
    private Long grade;

    @Column(name = "class_number", nullable = false)
    private Long classNumber;

    @OneToMany(mappedBy = "classInfo")
    private Set<MembersClass> membersClasses = new LinkedHashSet<>();

    @Builder
    public ClassInfo(School school, Long grade, Long classNumber) {
        this.school = school;
        this.grade = grade;
        this.classNumber = classNumber;
    }

    public static ClassInfo from(School school, Long grade, Long classNumber) {
        return ClassInfo.builder().school(school).grade(grade).classNumber(classNumber).build();
    }

    public void updateTeacher(Member teacher) {
        this.teacher = teacher;
    }
}