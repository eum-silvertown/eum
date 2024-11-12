package com.eum.notification_service.config.firebase;

import java.io.FileInputStream;

import org.springframework.context.annotation.Configuration;

import com.eum.notification_service.common.exception.ErrorCode;
import com.eum.notification_service.common.exception.EumException;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;

@Configuration
public class FirebaseConfig {

	@PostConstruct
	public void init() {
		try {
			ClassPathResource resource = new ClassPathResource("firebaseAccountKey.json");

			FirebaseOptions options = new FirebaseOptions.Builder()
				.setCredentials(GoogleCredentials.fromStream(resource.getInputStream()))
				.build();

			FirebaseApp.initializeApp(options);
		} catch (Exception e) {
			throw new EumException(ErrorCode.FIREBASE_CONNECT_ERROR);
		}
	}
}
