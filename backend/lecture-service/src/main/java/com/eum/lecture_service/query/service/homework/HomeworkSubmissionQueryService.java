package com.eum.lecture_service.query.service.homework;

import java.util.List;

import com.eum.lecture_service.query.document.studentInfo.HomeworkProblemSubmissionInfo;
import com.eum.lecture_service.query.document.studentInfo.HomeworkSubmissionInfo;

public interface HomeworkSubmissionQueryService {
	HomeworkSubmissionInfo getStudentHomeworkSubmission(Long lectureId, Long homeworkId, Long studentId);

	List<HomeworkSubmissionInfo> getHomeworkSubmissions(Long lectureId, Long homeworkId);

	HomeworkProblemSubmissionInfo getHomeworkProblemSubmission(Long lectureId, Long homeworkId, Long studentId, Long problemId);
}
