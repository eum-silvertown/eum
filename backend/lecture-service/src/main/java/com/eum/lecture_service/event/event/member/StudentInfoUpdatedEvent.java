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
public class StudentInfoUpdatedEvent {
    private Long studentId;
    private String name;
    private String image;
    private Long classId;
    private Long grade;
    private Long classNumber;
}