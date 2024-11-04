package com.eum.user_service.domain.mail.service;

import com.eum.user_service.domain.mail.dto.EmailAuthCheckRequest;
import com.eum.user_service.domain.mail.dto.EmailAuthRequest;

public interface MailService {
    void emailAuthentication(EmailAuthRequest emailAuthRequest);

    void checkAuthenticationCode(EmailAuthCheckRequest emailAuthCheckRequest);
}