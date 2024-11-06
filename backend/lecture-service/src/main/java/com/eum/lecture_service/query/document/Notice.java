package com.eum.lecture_service.query.document;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notice {

	private Long noticeId;
	private String title;
	private String content;
	private LocalDateTime createdAt;
}
