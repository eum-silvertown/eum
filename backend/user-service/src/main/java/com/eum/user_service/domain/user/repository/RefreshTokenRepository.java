package com.eum.user_service.domain.user.repository;

import com.eum.user_service.domain.user.entity.RefreshToken;
import org.springframework.data.repository.CrudRepository;

public interface RefreshTokenRepository extends CrudRepository<RefreshToken, String> {
}
