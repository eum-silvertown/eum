package com.eum.user_service.domain.user.repository;

import com.eum.user_service.domain.user.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<Member, Long> {
}
