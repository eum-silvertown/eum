package com.eum.apigatewayservice.token.entitiy;

import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

@Getter
@NoArgsConstructor
public class BlacklistToken {

    @Id
    private String token;

    public BlacklistToken(String token) {
        this.token = token;
    }
}