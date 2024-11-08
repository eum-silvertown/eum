package com.eum.lecture_service.config.global;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.support.converter.StringJsonMessageConverter;

import com.eum.lecture_service.event.event.member.ClassEvent;
import com.eum.lecture_service.event.event.member.StudentInfoEvent;
import com.eum.lecture_service.event.event.member.TeacherInfoEvent;

@EnableKafka
@Configuration
public class KafkaConsumerConfig {

	@Bean
	public ConcurrentKafkaListenerContainerFactory<String, TeacherInfoEvent> teacherKafkaListenerContainerFactory(
		ConsumerFactory<String, TeacherInfoEvent> consumerFactory) {
		ConcurrentKafkaListenerContainerFactory<String, TeacherInfoEvent> factory =
			new ConcurrentKafkaListenerContainerFactory<>();
		factory.setConsumerFactory(consumerFactory);
		factory.setRecordMessageConverter(new StringJsonMessageConverter()); // JSON 변환기 설정
		factory.setConcurrency(3); // 병렬성 설정
		return factory;
	}

	@Bean
	public ConcurrentKafkaListenerContainerFactory<String, TeacherInfoEvent> teacherUpdateKafkaListenerContainerFactory(
		ConsumerFactory<String, TeacherInfoEvent> consumerFactory) {
		ConcurrentKafkaListenerContainerFactory<String, TeacherInfoEvent> factory =
			new ConcurrentKafkaListenerContainerFactory<>();
		factory.setConsumerFactory(consumerFactory);
		factory.setRecordMessageConverter(new StringJsonMessageConverter());
		factory.setConcurrency(2); // 병렬성 설정 (다르게 설정 가능)
		return factory;
	}

	@Bean
	public ConcurrentKafkaListenerContainerFactory<String, ClassEvent> classKafkaListenerContainerFactory(
		ConsumerFactory<String, ClassEvent> consumerFactory) {
		ConcurrentKafkaListenerContainerFactory<String, ClassEvent> factory =
			new ConcurrentKafkaListenerContainerFactory<>();
		factory.setConsumerFactory(consumerFactory);
		factory.setRecordMessageConverter(new StringJsonMessageConverter());
		return factory;
	}

	@Bean
	public ConcurrentKafkaListenerContainerFactory<String, StudentInfoEvent> studentKafkaListenerContainerFactory(
		ConsumerFactory<String, StudentInfoEvent> consumerFactory) {
		ConcurrentKafkaListenerContainerFactory<String, StudentInfoEvent> factory =
			new ConcurrentKafkaListenerContainerFactory<>();
		factory.setConsumerFactory(consumerFactory);
		factory.setRecordMessageConverter(new StringJsonMessageConverter());
		return factory;
	}

	@Bean
	public ConcurrentKafkaListenerContainerFactory<String, StudentInfoEvent> studentUpdateKafkaListenerContainerFactory(
		ConsumerFactory<String, StudentInfoEvent> consumerFactory) {
		ConcurrentKafkaListenerContainerFactory<String, StudentInfoEvent> factory =
			new ConcurrentKafkaListenerContainerFactory<>();
		factory.setConsumerFactory(consumerFactory);
		factory.setRecordMessageConverter(new StringJsonMessageConverter());
		return factory;
	}
}