package com.eum.user_service.domain.user.repository;


import com.eum.user_service.domain.user.entity.MembersClass;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberClassRepository extends JpaRepository<MembersClass, Long> {
}
