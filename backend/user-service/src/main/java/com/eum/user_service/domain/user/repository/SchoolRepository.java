package com.eum.user_service.domain.user.repository;

import com.eum.user_service.domain.user.entity.School;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SchoolRepository extends JpaRepository<School, Long> {
    Optional<School> findByName(String schoolName);
}
