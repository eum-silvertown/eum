package com.eum.user_service.domain.event.service;

import com.eum.user_service.domain.event.dto.*;
import com.eum.user_service.domain.user.entity.Member;

public interface EventProducer {

    void sendMemberCreatedEvent(Member member);
    void sendTeacherCreatedEvent(TeacherInfoEvent event);
    void sendTeacherUpdatedEvent(TeacherImageEvent event);
    void sendClassCreatedEvent(ClassEvent event);
    void sendStudentCreatedEvent(StudentInfoEvent event);
    void sendStudentUpdatedEvent(StudentImageEvent event);
}
