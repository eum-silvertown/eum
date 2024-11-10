package com.eum.lecture_service.query.document;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.eum.lecture_service.query.document.studentInfo.ExamSubmissionInfo;
import com.eum.lecture_service.query.document.studentInfo.HomeworkSubmissionInfo;
import com.eum.lecture_service.query.document.studentInfo.Overview;
import com.eum.lecture_service.query.document.studentInfo.StudentScores;

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
@Document(collection = "student_overviews")
public class StudentOverviewModel {

    @Id
    private String id;
    private Long studentId;
    private Long lectureId;
    private Overview overview;
    private StudentScores studentScores;
    private List<HomeworkSubmissionInfo> homeworkSubmissionInfo = new ArrayList<>();
    private List<ExamSubmissionInfo> examSubmissionInfo = new ArrayList<>();
}
