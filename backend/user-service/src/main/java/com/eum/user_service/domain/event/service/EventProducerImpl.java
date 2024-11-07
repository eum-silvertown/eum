package com.eum.user_service.domain.event.service;

import com.eum.user_service.domain.event.dto.ClassEvent;
import com.eum.user_service.domain.event.dto.StudentInfoEvent;
import com.eum.user_service.domain.event.dto.TeacherInfoEvent;
import com.eum.user_service.domain.event.entity.KafkaTopics;
import com.eum.user_service.domain.user.entity.Member;
import com.eum.user_service.global.exception.ErrorCode;
import com.eum.user_service.global.exception.EumException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EventProducerImpl implements EventProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @Override
    public void sendMemberCreatedEvent(Member member) {
        kafkaTemplate.send(KafkaTopics.SIGN_UP.getTopicName(), String.valueOf(member.getId()));
    }

    @Override
    public void sendTeacherCreatedEvent(TeacherInfoEvent event) {
        try {
            String eventToJson = objectMapper.writeValueAsString(event); // JSON 문자열로 변환
            kafkaTemplate.send(KafkaTopics.CREATE_TEACHER.getTopicName(), eventToJson);
        } catch (Exception e) {
            throw new EumException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public void sendTeacherUpdatedEvent(TeacherInfoEvent event) {
        try {
            String eventToJson = objectMapper.writeValueAsString(event); // JSON 문자열로 변환
            kafkaTemplate.send(KafkaTopics.UPDATE_TEACHER.getTopicName(), eventToJson);
        } catch (Exception e) {
            throw new EumException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public void sendClassCreatedEvent(ClassEvent event) {
        try {
            String eventToJson = objectMapper.writeValueAsString(event); // JSON 문자열로 변환
            kafkaTemplate.send(KafkaTopics.CREATE_CLASS.getTopicName(), eventToJson);
        } catch (Exception e) {
            throw new EumException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public void sendStudentCreatedEvent(StudentInfoEvent event) {
        try {
            String eventToJson = objectMapper.writeValueAsString(event); // JSON 문자열로 변환
            kafkaTemplate.send(KafkaTopics.CREATE_STUDENT.getTopicName(), eventToJson);
        } catch (Exception e) {
            throw new EumException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public void sendStudentUpdatedEvent(StudentInfoEvent event) {
        try {
            String eventToJson = objectMapper.writeValueAsString(event); // JSON 문자열로 변환
            kafkaTemplate.send(KafkaTopics.UPDATE_STUDENT.getTopicName(), eventToJson);
        } catch (Exception e) {
            throw new EumException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }
}
