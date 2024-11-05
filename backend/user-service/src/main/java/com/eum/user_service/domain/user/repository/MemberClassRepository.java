package com.eum.user_service.domain.user.repository;


import com.eum.user_service.domain.user.entity.MembersClass;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberClassRepository extends JpaRepository<MembersClass, Long> {
    Optional<MembersClass> findByMemberId(Long memberId);
}
