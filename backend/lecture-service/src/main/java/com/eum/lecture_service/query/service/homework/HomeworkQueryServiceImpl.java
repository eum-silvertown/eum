package com.eum.lecture_service.query.service.homework;

import org.springframework.stereotype.Service;

import com.eum.lecture_service.query.document.lectureInfo.HomeworkInfo;

@Service
public class HomeworkQueryServiceImpl implements HomeworkQueryService {
	@Override
	public HomeworkInfo getHomeworkDetail(Long lectureId, Long homeworkId) {
		return null;
	}
}
