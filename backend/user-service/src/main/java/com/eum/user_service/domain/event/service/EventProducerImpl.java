package com.eum.user_service.domain.event.service;

import com.eum.user_service.domain.event.dto.ClassEvent;
import com.eum.user_service.domain.event.dto.StudentInfoEvent;
import com.eum.user_service.domain.event.dto.TeacherInfoEvent;
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

    private static final String SIGN_UP_TOPIC = "signup-topic";
    private static final String CREATE_TEACHER_TOPIC = "create_teacher";
    private static final String UPDATE_TEACHER_TOPIC = "update_teacher";
    private static final String CREATE_CLASS_TOPIC = "create_class";
    private static final String CREATE_STUDENT_TOPIC = "create_student";
    private static final String UPDATE_STUDENT_TOPIC = "update_student";

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @Override
    public void sendMemberCreatedEvent(Member member) {
        kafkaTemplate.send(SIGN_UP_TOPIC,String.valueOf(member.getId()));
    }

    @Override
    public void sendTeacherCreatedEvent(TeacherInfoEvent event) {
        try {
            String eventToJson = objectMapper.writeValueAsString(event); // JSON 문자열로 변환
            kafkaTemplate.send(CREATE_TEACHER_TOPIC, eventToJson);
        } catch (Exception e) {
            throw new EumException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public void sendTeacherUpdatedEvent(TeacherInfoEvent event) {
        try {
            String eventToJson = objectMapper.writeValueAsString(event); // JSON 문자열로 변환
            kafkaTemplate.send(UPDATE_TEACHER_TOPIC, eventToJson);
        } catch (Exception e) {
            throw new EumException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public void sendClassCreatedEvent(ClassEvent event) {
        try {
            String eventToJson = objectMapper.writeValueAsString(event); // JSON 문자열로 변환
            kafkaTemplate.send(CREATE_CLASS_TOPIC, eventToJson);
        } catch (Exception e) {
            throw new EumException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public void sendStudentCreatedEvent(StudentInfoEvent event) {
        try {
            String eventToJson = objectMapper.writeValueAsString(event); // JSON 문자열로 변환
            kafkaTemplate.send(CREATE_STUDENT_TOPIC, eventToJson);
        } catch (Exception e) {
            throw new EumException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public void sendStudentUpdatedEvent(StudentInfoEvent event) {
        try {
            String eventToJson = objectMapper.writeValueAsString(event); // JSON 문자열로 변환
            kafkaTemplate.send(UPDATE_STUDENT_TOPIC, eventToJson);
        } catch (Exception e) {
            throw new EumException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }
}
