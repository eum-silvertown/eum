package com.eum.lecture_service.command.repository.notice;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eum.lecture_service.command.entity.lecture.Notice;

public interface NoticeRepository extends JpaRepository<Notice, Long> {
}
