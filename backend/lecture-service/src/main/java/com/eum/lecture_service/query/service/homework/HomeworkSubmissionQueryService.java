package com.eum.lecture_service.query.service.homework;

import java.util.List;

import com.eum.lecture_service.query.dto.homework.HomeworkProblemSubmissionInfoResponse;
import com.eum.lecture_service.query.dto.homework.HomeworkSubmissionInfoResponse;
import com.eum.lecture_service.query.dto.homework.HomeworkSubmissionsInfoResponse;
import com.eum.lecture_service.query.dto.homework.StudentHomeworkResponse;

public interface HomeworkSubmissionQueryService {
	HomeworkSubmissionInfoResponse getStudentHomeworkSubmission(Long lectureId, Long homeworkId, Long studentId);

	List<HomeworkSubmissionsInfoResponse> getHomeworkSubmissions(Long lectureId, Long homeworkId);

	HomeworkProblemSubmissionInfoResponse getHomeworkProblemSubmission(Long lectureId, Long homeworkId, Long studentId, Long problemId);

	List<HomeworkSubmissionInfoResponse> getAllHomeworkSubmissionsByStudent(Long lectureId, Long studentId);

	StudentHomeworkResponse getStudentAllLectureHomeworkOverview(Long studentId);
}
