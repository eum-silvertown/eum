package com.eum.drawingservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class DrawingServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(DrawingServiceApplication.class, args);
    }

}
