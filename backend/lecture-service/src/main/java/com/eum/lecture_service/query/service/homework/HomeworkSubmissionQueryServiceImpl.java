package com.eum.lecture_service.query.service.homework;

import java.util.List;

import org.springframework.stereotype.Service;

import com.eum.lecture_service.query.document.studentInfo.HomeworkProblemSubmissionInfo;
import com.eum.lecture_service.query.document.studentInfo.HomeworkSubmissionInfo;

@Service
public class HomeworkSubmissionQueryServiceImpl implements HomeworkSubmissionQueryService {
	@Override
	public HomeworkSubmissionInfo getStudentHomeworkSubmission(Long lectureId, Long homeworkId, Long studentId) {
		return null;
	}

	@Override
	public List<HomeworkSubmissionInfo> getHomeworkSubmissions(Long lectureId, Long homeworkId) {
		return List.of();
	}

	@Override
	public HomeworkProblemSubmissionInfo getHomeworkProblemSubmission(Long lectureId, Long homeworkId, Long studentId,
		Long problemId) {
		return null;
	}
}
