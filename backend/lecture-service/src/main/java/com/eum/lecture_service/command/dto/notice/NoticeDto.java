package com.eum.lecture_service.command.dto.notice;

import com.eum.lecture_service.command.entity.lecture.Lecture;
import com.eum.lecture_service.command.entity.lecture.Notice;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NoticeDto {

	private Long noticeId;
	private Long lectureId;
	private String title;
	private String content;

	public Notice toNoticeEntity(Lecture lecture) {
		return Notice.builder()
			.lecture(lecture)
			.title(title)
			.content(content)
			.build();
	}

	public static NoticeDto fromEntity(Notice notice) {
		return NoticeDto.builder()
			.noticeId(notice.getNoticeId())
			.lectureId(notice.getLecture().getLectureId())
			.title(notice.getTitle())
			.content(notice.getContent())
			.build();
	}
}
