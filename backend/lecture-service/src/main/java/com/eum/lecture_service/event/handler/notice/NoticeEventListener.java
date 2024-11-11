package com.eum.lecture_service.event.handler.notice;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.eum.lecture_service.config.exception.ErrorCode;
import com.eum.lecture_service.config.exception.EumException;
import com.eum.lecture_service.event.event.notice.NoticeCreateEvent;
import com.eum.lecture_service.event.event.notice.NoticeDeletedEvent;
import com.eum.lecture_service.query.document.LectureModel;
import com.eum.lecture_service.query.document.lectureInfo.NoticeInfo;
import com.eum.lecture_service.query.repository.LectureReadRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NoticeEventListener {

	private final LectureReadRepository lectureReadRepository;

	@KafkaListener(topics = "notice-create-topic", groupId = "notice-group",  properties = {
		"spring.json.value.default.type=com.eum.lecture_service.event.event.notice.NoticeCreateEvent"
	})
	public void handleNoticeCreate(NoticeCreateEvent event) {
		LectureModel lecture = lectureReadRepository.findById(event.getLectureId())
			.orElseThrow(() -> new EumException(ErrorCode.LECTURE_NOT_FOUND));

		NoticeInfo notice = createNoticeInfo(event);
		lecture.getNotices().add(notice);
		lectureReadRepository.save(lecture);
	}

	@KafkaListener(topics = "notice-delete-topic", groupId = "notice-group",  properties = {
		"spring.json.value.default.type=com.eum.lecture_service.event.event.notice.NoticeDeletedEvent"
	})
	public void handleNoticeDelete(NoticeDeletedEvent event) {
		LectureModel lecture = lectureReadRepository.findById(event.getLectureId())
			.orElseThrow(() -> new EumException(ErrorCode.LECTURE_NOT_FOUND));

		lecture.getNotices().removeIf(notice -> notice.getNoticeId().equals(event.getNoticeId()));
		lectureReadRepository.save(lecture);
	}

	private NoticeInfo createNoticeInfo(NoticeCreateEvent event) {
		return new NoticeInfo(
			event.getNoticeId(),
			event.getTitle(),
			event.getContent(),
			event.getCreatedAt()
		);
	}
}
