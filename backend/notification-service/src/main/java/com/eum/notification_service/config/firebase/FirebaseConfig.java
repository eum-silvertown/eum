package com.eum.notification_service.config.firebase;

import java.io.FileInputStream;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.eum.notification_service.config.exception.ErrorCode;
import com.eum.notification_service.config.exception.EumException;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

import jakarta.annotation.PostConstruct;

@Configuration
public class FirebaseConfig {

	@PostConstruct
	public void init() {
		try {
			FileInputStream serviceAccount =
				new FileInputStream("path/to/serviceAccountKey.json");

			FirebaseOptions options = new FirebaseOptions.Builder()
				.setCredentials(GoogleCredentials.fromStream(serviceAccount))
				.build();

			FirebaseApp.initializeApp(options);
		} catch (Exception e) {
			throw new EumException(ErrorCode.FIREBASE_CONNECT_ERROR);
		}
	}
}
