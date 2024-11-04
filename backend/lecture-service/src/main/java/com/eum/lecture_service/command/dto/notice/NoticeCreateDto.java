package com.eum.lecture_service.command.dto.notice;

import com.eum.lecture_service.command.entity.folder.Folder;
import com.eum.lecture_service.command.entity.lecture.Notice;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class NoticeCreateDto {

	private Long lectureId;
	private String title;
	private String content;

	public Notice toNoticeEntity() {
		return Notice.builder()
			.lectureId(lectureId)
			.title(title)
			.content(content)
			.build();
	}
}
