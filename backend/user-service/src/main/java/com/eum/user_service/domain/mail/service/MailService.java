package com.eum.user_service.domain.mail.service;

import com.eum.user_service.domain.mail.dto.FindIdRequest;

public interface MailService {
    void emailAuthentication(FindIdRequest findIdRequest);
}