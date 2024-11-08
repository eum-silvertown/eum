package com.eum.lecture_service.config.global;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.support.serializer.ErrorHandlingDeserializer;
import org.springframework.kafka.support.serializer.JsonDeserializer;

import com.eum.lecture_service.event.event.member.ClassEvent;
import com.eum.lecture_service.event.event.member.StudentInfoEvent;
import com.eum.lecture_service.event.event.member.TeacherInfoEvent;

import java.util.HashMap;
import java.util.Map;

@EnableKafka
@Configuration
public class KafkaConsumerConfig {

	@Value("${spring.kafka.bootstrap-servers}")
	private String bootstrapServers;

	@Value("${spring.kafka.consumer.group-id}")
	private String groupId;

	// 공통 설정
	private Map<String, Object> commonConfigs() {
		Map<String, Object> props = new HashMap<>();
		props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
		props.put(ConsumerConfig.GROUP_ID_CONFIG, groupId);
		props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
		props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, ErrorHandlingDeserializer.class);
		props.put(ErrorHandlingDeserializer.VALUE_DESERIALIZER_CLASS, JsonDeserializer.class.getName());
		props.put(JsonDeserializer.TRUSTED_PACKAGES, "com.eum.lecture_service.event.event.member");
		props.put(JsonDeserializer.USE_TYPE_INFO_HEADERS, false);
		return props;
	}

	@Bean
	public ConsumerFactory<String, TeacherInfoEvent> teacherConsumerFactory() {
		JsonDeserializer<TeacherInfoEvent> deserializer = new JsonDeserializer<>(TeacherInfoEvent.class);
		deserializer.addTrustedPackages("com.eum.lecture_service.event.event.member");

		return new DefaultKafkaConsumerFactory<>(
			commonConfigs(),
			new StringDeserializer(),
			deserializer
		);
	}

	@Bean
	public ConsumerFactory<String, TeacherInfoEvent> teacherUpdateConsumerFactory() {
		JsonDeserializer<TeacherInfoEvent> deserializer = new JsonDeserializer<>(TeacherInfoEvent.class);
		deserializer.addTrustedPackages("com.eum.lecture_service.event.event.member");

		return new DefaultKafkaConsumerFactory<>(
			commonConfigs(),
			new StringDeserializer(),
			deserializer
		);
	}

	// ClassEvent용 ConsumerFactory
	@Bean
	public ConsumerFactory<String, ClassEvent> classConsumerFactory() {
		JsonDeserializer<ClassEvent> deserializer = new JsonDeserializer<>(ClassEvent.class);
		deserializer.addTrustedPackages("com.eum.lecture_service.event.event.member");

		return new DefaultKafkaConsumerFactory<>(
			commonConfigs(),
			new StringDeserializer(),
			deserializer
		);
	}

	// StudentInfoEvent용 ConsumerFactory
	@Bean
	public ConsumerFactory<String, StudentInfoEvent> studentConsumerFactory() {
		JsonDeserializer<StudentInfoEvent> deserializer = new JsonDeserializer<>(StudentInfoEvent.class);
		deserializer.addTrustedPackages("com.eum.lecture_service.event.event.member");

		return new DefaultKafkaConsumerFactory<>(
			commonConfigs(),
			new StringDeserializer(),
			deserializer
		);
	}

	// StudentInfoEvent 업데이트용 ConsumerFactory
	@Bean
	public ConsumerFactory<String, StudentInfoEvent> studentUpdateConsumerFactory() {
		JsonDeserializer<StudentInfoEvent> deserializer = new JsonDeserializer<>(StudentInfoEvent.class);
		deserializer.addTrustedPackages("com.eum.lecture_service.event.event.member");

		return new DefaultKafkaConsumerFactory<>(
			commonConfigs(),
			new StringDeserializer(),
			deserializer
		);
	}

	// Teacher Listener Container Factory
	@Bean
	public ConcurrentKafkaListenerContainerFactory<String, TeacherInfoEvent> teacherKafkaListenerContainerFactory() {
		ConcurrentKafkaListenerContainerFactory<String, TeacherInfoEvent> factory =
			new ConcurrentKafkaListenerContainerFactory<>();
		factory.setConsumerFactory(teacherConsumerFactory());
		factory.setConcurrency(3);
		return factory;
	}

	// Teacher 업데이트 Listener Container Factory
	@Bean
	public ConcurrentKafkaListenerContainerFactory<String, TeacherInfoEvent> teacherUpdateKafkaListenerContainerFactory() {
		ConcurrentKafkaListenerContainerFactory<String, TeacherInfoEvent> factory =
			new ConcurrentKafkaListenerContainerFactory<>();
		factory.setConsumerFactory(teacherUpdateConsumerFactory());
		factory.setConcurrency(2);
		return factory;
	}

	// Class Listener Container Factory
	@Bean
	public ConcurrentKafkaListenerContainerFactory<String, ClassEvent> classKafkaListenerContainerFactory() {
		ConcurrentKafkaListenerContainerFactory<String, ClassEvent> factory =
			new ConcurrentKafkaListenerContainerFactory<>();
		factory.setConsumerFactory(classConsumerFactory());
		return factory;
	}

	// Student Listener Container Factory
	@Bean
	public ConcurrentKafkaListenerContainerFactory<String, StudentInfoEvent> studentKafkaListenerContainerFactory() {
		ConcurrentKafkaListenerContainerFactory<String, StudentInfoEvent> factory =
			new ConcurrentKafkaListenerContainerFactory<>();
		factory.setConsumerFactory(studentConsumerFactory());
		return factory;
	}

	// Student 업데이트 Listener Container Factory
	@Bean
	public ConcurrentKafkaListenerContainerFactory<String, StudentInfoEvent> studentUpdateKafkaListenerContainerFactory() {
		ConcurrentKafkaListenerContainerFactory<String, StudentInfoEvent> factory =
			new ConcurrentKafkaListenerContainerFactory<>();
		factory.setConsumerFactory(studentUpdateConsumerFactory());
		return factory;
	}
}
