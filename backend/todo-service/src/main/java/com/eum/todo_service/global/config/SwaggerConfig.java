package com.eum.todo_service.global.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Value("${spring.swagger.server.url}")
    private String SERVER_URL;

    @Bean
    public OpenAPI openAPI() {
        // Define the security scheme as API Key in the header
        SecurityScheme securityScheme = new SecurityScheme()
                .type(SecurityScheme.Type.APIKEY)
                .in(SecurityScheme.In.HEADER)
                .name("Authorization");

        // Define the security requirement for the API Key
        SecurityRequirement securityRequirement = new SecurityRequirement()
                .addList("jwtAuth");

        return new OpenAPI()
                .addServersItem(new Server().url(SERVER_URL))
                .components(new Components().addSecuritySchemes("jwtAuth", securityScheme))
                .addSecurityItem(securityRequirement)
                .info(apiInfo());
    }

    private Info apiInfo() {
        return new Info()
                .title("Eum API Reference for Developers")
                .description("SSAFY 자율 PJT D101")
                .version("1.0.0");
    }
}

