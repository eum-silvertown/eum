package com.eum.user_service.domain.mail.entity;

import com.eum.user_service.domain.mail.dto.EmailAuthRequest;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;

@Getter
@NoArgsConstructor
@RedisHash(value = "EmailValidationCode")
public class EmailValidationCode {

    @Id
    private String userCode;

    private String validationCode;

    @TimeToLive
    private Long expireTime;

    @Builder
    public EmailValidationCode(String userCode, String validationCode, Long expireTime) {
        this.userCode = userCode;
        this.validationCode = validationCode;
        this.expireTime = expireTime;
    }

    public static EmailValidationCode of(EmailAuthRequest emailAuthRequest, String validationCode, Long expireTime) {
        return EmailValidationCode.builder()
                .userCode(emailAuthRequest.email())
                .validationCode(validationCode)
                .expireTime(expireTime)
                .build();
    }
}
