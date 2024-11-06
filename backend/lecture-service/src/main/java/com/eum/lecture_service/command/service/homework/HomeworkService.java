package com.eum.lecture_service.command.service.homework;

import com.eum.lecture_service.command.dto.homework.HomeworkDto;

public interface HomeworkService {
	Long createHomework(HomeworkDto homeworkDto);

	Long updateHomework(Long homeworkId, HomeworkDto homeworkDto);

	void deleteHomework(Long homeworkId);
}
