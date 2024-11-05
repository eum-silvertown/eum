package com.eum.apigatewayservice.auth.filter;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import com.eum.apigatewayservice.auth.jwt.JwtUtil;
import com.eum.apigatewayservice.exception.ErrorCode;
import com.eum.apigatewayservice.exception.EumException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import com.eum.apigatewayservice.auth.filter.AuthorizationHeaderFilter.Config;

@Slf4j
@Component
public class AuthorizationHeaderFilter extends AbstractGatewayFilterFactory<Config> {

    @Value("${jwt.secret}")
    private String secret;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthorizationHeaderFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            try {
                String token = exchange.getRequest().getHeaders().get(AUTHORIZATION).get(0);

                Claims claims = jwtUtil.getClaims(token);

                addAuthorizationHeaders(exchange.getRequest(), claims);
            } catch (ExpiredJwtException ex) {
                throw new EumException(ErrorCode.ACCESS_TOKEN_EXPIRED);
            } catch (MalformedJwtException | SignatureException | IllegalArgumentException |
                     NullPointerException ex) {
                throw new EumException(ErrorCode.AUTHENTICATION_FAILED);
            }

            return chain.filter(exchange);
        };
    }

    private void addAuthorizationHeaders(ServerHttpRequest request, Claims claims) {
        request.mutate()
                .header("X-MEMBER-ID", String.valueOf(claims.get("userId", Long.class)))
                .header("X-MEMBER-ROLE", claims.get("role", String.class))
                .build();
    }

    static class Config {

    }
}


