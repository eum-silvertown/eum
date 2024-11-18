package com.eum.lecture_service.query.service.homework;

import com.eum.lecture_service.query.dto.homework.HomeworkInfoResponse;

public interface HomeworkQueryService {

	HomeworkInfoResponse getHomeworkDetail(Long lectureId, Long homeworkId);
}
