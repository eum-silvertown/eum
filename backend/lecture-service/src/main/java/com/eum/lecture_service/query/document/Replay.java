package com.eum.lecture_service.query.document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Replay {

	private Long replayId;
	private String title;
	private String videoUrl;
	private String playtime;
}
