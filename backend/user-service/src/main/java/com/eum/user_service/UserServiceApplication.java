package com.eum.user_service;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import java.util.TimeZone;

@SpringBootApplication
@EnableDiscoveryClient
@EnableJpaAuditing // JPA Auditing 활성화
public class UserServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(UserServiceApplication.class, args);
	}

	@PostConstruct
	public void init() {
		// timezone 설정
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Seoul"));
	}

}
