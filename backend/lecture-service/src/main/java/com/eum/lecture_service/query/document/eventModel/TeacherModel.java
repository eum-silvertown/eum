package com.eum.lecture_service.query.document.eventModel;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

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
@Document(collection = "teachers")
public class TeacherModel {

    @Id
    private Long teacherId;
    private String name;
    private String email;
    private String tel;
    private String image;
}