package com.eum.lecture_service.query.document;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Overview {

	private Long homeworkCount;
	private Long examCount;
	private Long problemBoxCount;
}
