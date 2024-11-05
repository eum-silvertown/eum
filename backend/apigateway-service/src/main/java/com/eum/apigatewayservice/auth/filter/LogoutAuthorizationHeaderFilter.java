package com.eum.apigatewayservice.auth.filter;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import com.eum.apigatewayservice.auth.jwt.JwtUtil;
import com.eum.apigatewayservice.token.service.BlacklistTokenService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import com.eum.apigatewayservice.auth.filter.LogoutAuthorizationHeaderFilter.Config;

@Slf4j
@Component
public class LogoutAuthorizationHeaderFilter extends AbstractGatewayFilterFactory<Config> {

    @Autowired
    private BlacklistTokenService blacklistTokenService;

    @Autowired
    private JwtUtil jwtUtil;

    public LogoutAuthorizationHeaderFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            log.info("logout");
            String token = exchange.getRequest().getHeaders().getFirst("Authorization");
                // 서비스 단으로 Authorization 헤더를 전달
            ServerHttpRequest modifiedRequest = exchange.getRequest().mutate()
                    .header("Authorization", token)
                    .build();

            return chain.filter(exchange.mutate().request(modifiedRequest).build());

        };
    }

    public static class Config {
        // 필요에 따라 추가 설정을 넣을 수 있습니다.
    }
}
