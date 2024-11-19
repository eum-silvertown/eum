package com.eum.user_service.domain.event.service;

import com.eum.user_service.domain.event.dto.*;
import com.eum.user_service.domain.event.entity.KafkaTopics;
import com.eum.user_service.domain.user.entity.Member;
import com.eum.user_service.global.exception.ErrorCode;
import com.eum.user_service.global.exception.EumException;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EventProducerImpl implements EventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Override
    public void sendMemberCreatedEvent(Member member) {
        kafkaTemplate.send(KafkaTopics.SIGN_UP.getTopicName(), String.valueOf(member.getId()));
    }

    @Override
    public void sendTeacherCreatedEvent(TeacherInfoEvent event) {
        try {
            kafkaTemplate.send(KafkaTopics.CREATE_TEACHER.getTopicName(), event);
        } catch (Exception e) {
            throw new EumException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public void sendTeacherUpdatedEvent(TeacherImageEvent event) {
        try {
            kafkaTemplate.send(KafkaTopics.UPDATE_TEACHER.getTopicName(), event);
        } catch (Exception e) {
            throw new EumException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public void sendClassCreatedEvent(ClassEvent event) {
        try {
            kafkaTemplate.send(KafkaTopics.CREATE_CLASS.getTopicName(), event);
        } catch (Exception e) {
            throw new EumException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public void sendStudentCreatedEvent(StudentInfoEvent event) {
        try {
            kafkaTemplate.send(KafkaTopics.CREATE_STUDENT.getTopicName(), event);
        } catch (Exception e) {
            throw new EumException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public void sendStudentUpdatedEvent(StudentImageEvent event) {
        try {
            kafkaTemplate.send(KafkaTopics.UPDATE_STUDENT.getTopicName(), event);
        } catch (Exception e) {
            throw new EumException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }
}
