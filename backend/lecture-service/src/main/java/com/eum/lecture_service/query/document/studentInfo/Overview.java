package com.eum.lecture_service.query.document.studentInfo;

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
public class Overview {

	private Long homeworkCount;
	private Long examCount;
	private Long lessonCount;
}