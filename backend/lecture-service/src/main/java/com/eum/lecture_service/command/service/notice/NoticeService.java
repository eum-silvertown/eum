package com.eum.lecture_service.command.service.notice;

import java.util.Optional;

import com.eum.lecture_service.command.dto.notice.NoticeDto;
import com.eum.lecture_service.command.entity.lecture.Notice;

public interface NoticeService {

	Long createNotice(NoticeDto noticeDto);

	void updateNotice(Long noticeId, NoticeDto noticeDto);

	void deleteNotice(Long noticeId);

	Optional<Notice> getNotice(Long noticeId);
}
