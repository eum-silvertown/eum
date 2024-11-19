package com.eum.lecture_service.event.event.lecture;

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
public class LectureMinusAttitudeEvent {

	private Long lectureId;
	private Long studentId;
}
