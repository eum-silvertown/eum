package com.eum.user_service.domain.user.repository;

import com.eum.user_service.domain.user.entity.School;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.Repository;

public interface SchoolRepository extends JpaRepository<School, Long> {
}
