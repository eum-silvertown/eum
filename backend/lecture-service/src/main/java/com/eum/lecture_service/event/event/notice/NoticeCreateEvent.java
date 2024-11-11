package com.eum.lecture_service.event.event.notice;

import java.time.LocalDateTime;

import com.eum.lecture_service.command.dto.notice.NoticeDto;
import com.eum.lecture_service.command.entity.lecture.Notice;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NoticeCreateEvent {

	private Long noticeId;
	private Long lectureId;
	private String title;
	private String content;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;

	public NoticeCreateEvent(Notice noticeDto) {
		this.noticeId = noticeDto.getNoticeId();
		this.lectureId = noticeDto.getLecture().getLectureId();
		this.title = noticeDto.getTitle();
		this.content = noticeDto.getContent();
		this.createdAt = noticeDto.getCreatedAt();
		this.updatedAt = noticeDto.getUpdatedAt();
	}
}
