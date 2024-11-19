package com.eum.lecture_service.query.dto.lecture;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TodayDto {

	private String day;
	private Long year;
	private Long semester;
}
