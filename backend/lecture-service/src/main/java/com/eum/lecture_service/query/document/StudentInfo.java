package com.eum.lecture_service.query.document;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentInfo {

	private Long studentId;
	private String name;
	private String imageUrl;
}
