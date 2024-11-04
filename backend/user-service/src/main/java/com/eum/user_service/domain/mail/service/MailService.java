package com.eum.user_service.domain.mail.service;

import com.eum.user_service.domain.mail.dto.EmailAuthCheckRequest;
import com.eum.user_service.domain.mail.dto.EmailAuthRequest;
import com.eum.user_service.domain.mail.dto.FindIdResponse;
import com.eum.user_service.domain.mail.dto.FindPasswordRequest;

public interface MailService {
    void emailAuthentication(EmailAuthRequest emailAuthRequest);

    void checkAuthenticationCode(EmailAuthCheckRequest emailAuthCheckRequest);

    FindIdResponse findIdWithAuthentication(EmailAuthCheckRequest emailAuthCheckRequest);

    void emailAuthenticationForFindId(EmailAuthRequest emailAuthRequest);

    void emailAuthenticationForFindPassword(FindPasswordRequest findPasswordRequest);

    void findPasswordWithAuthentication(EmailAuthCheckRequest emailAuthCheckRequest);
}