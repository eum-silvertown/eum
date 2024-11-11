package com.eum.lecture_service.event.event.notice;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NoticeDeletedEvent {

	private Long lectureId;
	private Long noticeId;
}
