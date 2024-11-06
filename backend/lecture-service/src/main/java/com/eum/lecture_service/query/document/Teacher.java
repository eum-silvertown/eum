package com.eum.lecture_service.query.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Teacher {

	private Long teacherId;
	private String name;
	private String telephone;
	private String email;
	private String imageUrl;
}
