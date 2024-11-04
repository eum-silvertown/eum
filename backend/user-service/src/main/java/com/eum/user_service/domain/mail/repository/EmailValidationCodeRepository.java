package com.eum.user_service.domain.mail.repository;

import com.eum.user_service.domain.mail.entity.EmailValidationCode;
import org.springframework.data.repository.CrudRepository;

public interface EmailValidationCodeRepository extends CrudRepository<EmailValidationCode, Long> {
}
