package com.eum.user_service.domain.mail.service;

import com.eum.user_service.domain.mail.dto.EmailAuthCheckRequest;
import com.eum.user_service.domain.mail.dto.EmailAuthRequest;
import com.eum.user_service.domain.mail.dto.FindIdResponse;

public interface MailService {
    void emailAuthentication(EmailAuthRequest emailAuthRequest);

    void checkAuthenticationCode(EmailAuthCheckRequest emailAuthCheckRequest);

    FindIdResponse findIdWithAuthentication(EmailAuthCheckRequest emailAuthCheckRequest);
}