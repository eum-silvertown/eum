package com.eum.user_service.domain.mail.entity;

import com.eum.user_service.domain.mail.dto.EmailAuthRequest;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@Getter
@NoArgsConstructor
@RedisHash(value = "EmailValidationCode", timeToLive = 300)
public class EmailValidationCode {

    @Id
    private String userCode;

    private String validationCode;

    @Builder
    public EmailValidationCode(String userCode, String validationCode) {
        this.userCode = userCode;
        this.validationCode = validationCode;
    }

    public static EmailValidationCode of(EmailAuthRequest emailAuthRequest, String validationCode) {
        return EmailValidationCode.builder()
                .userCode(emailAuthRequest.email())
                .validationCode(validationCode)
                .build();
    }
}
