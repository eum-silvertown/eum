package com.eum.lecture_service.event.event.member;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeacherInfoUpdatedEvent {
    private Long teacherId;
    private String name;
    private String email;
    private String tel;
    private String image;
}