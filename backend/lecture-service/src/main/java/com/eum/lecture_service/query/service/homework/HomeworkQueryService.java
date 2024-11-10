package com.eum.lecture_service.query.service.homework;

import com.eum.lecture_service.query.document.lectureInfo.HomeworkInfo;

public interface HomeworkQueryService {

	HomeworkInfo getHomeworkDetail(Long lectureId, Long homeworkId);
}
