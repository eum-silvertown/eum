package com.eum.user_service.domain.event.service;

import com.eum.user_service.domain.event.dto.ClassEvent;
import com.eum.user_service.domain.event.dto.StudentInfoEvent;
import com.eum.user_service.domain.event.dto.TeacherInfoEvent;
import com.eum.user_service.domain.user.entity.Member;

public interface EventProducer {

    void sendMemberCreatedEvent(Member member);
    void sendTeacherCreatedEvent(TeacherInfoEvent event);
    void sendTeacherUpdatedEvent(TeacherInfoEvent event);
    void sendClassCreatedEvent(ClassEvent event);
    void sendStudentCreatedEvent(StudentInfoEvent event);
    void sendStudentUpdatedEvent(StudentInfoEvent event);
}
