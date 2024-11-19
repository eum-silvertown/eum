package com.eum.user_service.domain.event.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum KafkaTopics {
    SIGN_UP("signup-topic"),
    CREATE_TEACHER("create_teacher"),
    UPDATE_TEACHER("update_teacher"),
    CREATE_CLASS("create_class"),
    CREATE_STUDENT("create_student"),
    UPDATE_STUDENT("update_student");

    private final String topicName;
}
