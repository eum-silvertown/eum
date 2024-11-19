package com.eum.lecture_service.event.event.notice;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NoticeDeletedEvent {

	private Long lectureId;
	private Long noticeId;
}
