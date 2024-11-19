package com.eum.lecture_service.command.service.homework;

import java.util.List;

import com.eum.lecture_service.command.dto.homework.HomeworkProblemSubmissionDto;
import com.eum.lecture_service.command.entity.homework.HomeworkProblemSubmission;
import com.eum.lecture_service.command.entity.homework.HomeworkSubmission;

public interface HomeworkSubmissionService {
	Long submitHomeworkProblems(Long homeworkId, Long studentId, List<HomeworkProblemSubmissionDto> homeworkProblemSubmissions);
}
