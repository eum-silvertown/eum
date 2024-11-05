package com.eum.lecture_service.command.service.notice;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.eum.lecture_service.command.dto.notice.NoticeDto;
import com.eum.lecture_service.command.entity.lecture.Lecture;
import com.eum.lecture_service.command.entity.lecture.Notice;
import com.eum.lecture_service.command.repository.lecture.LectureRepository;
import com.eum.lecture_service.command.repository.notice.NoticeRepository;
import com.eum.lecture_service.config.exception.ErrorCode;
import com.eum.lecture_service.config.exception.EumException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NoticeServiceImpl implements NoticeService{

	private final NoticeRepository noticeRepository;
	private final LectureRepository lectureRepository;

	@Override
	@Transactional
	public void createNotice(NoticeDto noticeDto) {
		Lecture lecture = lectureRepository.findById(noticeDto.getLectureId())
			.orElseThrow(() -> new EumException(ErrorCode.LECTURE_NOT_FOUND));

		Notice notice = noticeDto.toNoticeEntity(lecture);
		noticeRepository.save(notice);
	}

	@Override
	@Transactional
	public void updateNotice(Long noticeId, NoticeDto noticeDto) {
		Notice notice = noticeRepository.findById(noticeId)
			.orElseThrow(() -> new EumException(ErrorCode.NOTICE_NOT_FOUND));

		if (noticeDto.getTitle() != null) {
			notice.setTitle(noticeDto.getTitle());
		}
		if (noticeDto.getContent() != null) {
			notice.setContent(noticeDto.getContent());
		}

		// Lecture 변경은 불가능하다고 가정
		noticeRepository.save(notice);
	}

	@Override
	public void deleteNotice(Long noticeId) {
		Notice notice = noticeRepository.findById(noticeId)
			.orElseThrow(() -> new EumException(ErrorCode.NOTICE_NOT_FOUND));

		noticeRepository.delete(notice);
	}

	@Override
	public Optional<Notice> getNotice(Long noticeId) {
		return Optional.empty();
	}
}
