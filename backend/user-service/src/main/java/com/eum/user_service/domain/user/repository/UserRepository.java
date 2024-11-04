package com.eum.user_service.domain.user.repository;

import com.eum.user_service.domain.user.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByUserId(String userId);
    Optional<Member> findByNameAndEmail(String name, String email);
    Boolean existsByEmail(String email);
    Optional<Member> findByEmail(String email);
}
