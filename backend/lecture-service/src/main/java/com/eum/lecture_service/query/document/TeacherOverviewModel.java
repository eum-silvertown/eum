package com.eum.lecture_service.query.document;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.eum.lecture_service.query.document.teacherInfo.ClassAverageScores;
import com.eum.lecture_service.query.document.teacherInfo.StudentInfo;

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
@Document(collection = "teacher_overviews")
public class TeacherOverviewModel {

    @Id
    private Long teacherId;
    private Long classId;
    private List<StudentInfo> students = new ArrayList<>();
    private ClassAverageScores classAverageScores;

}
