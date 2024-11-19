package com.eum.user_service.domain.user.repository;

import com.eum.user_service.domain.user.entity.ClassInfo;
import com.eum.user_service.domain.user.entity.School;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClassInfoRepository extends JpaRepository<ClassInfo, Long> {
    Optional<ClassInfo> findBySchoolAndGradeAndClassNumber(School school, Long grade, Long classNumber);
    Optional<ClassInfo> findByTeacherId(Long teacherId);
    Optional<ClassInfo> findByMembersClassesId(Long classInfoId);
}
