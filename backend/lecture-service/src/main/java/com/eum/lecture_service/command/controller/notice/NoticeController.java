package com.eum.lecture_service.command.controller.notice;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eum.lecture_service.command.dto.notice.NoticeDto;
import com.eum.lecture_service.command.service.notice.NoticeService;
import com.eum.lecture_service.common.RoleType;
import com.eum.lecture_service.config.exception.ErrorCode;
import com.eum.lecture_service.config.exception.EumException;
import com.eum.lecture_service.config.global.CommonResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/notice")
public class NoticeController {

	private final NoticeService noticeService;

	//공지사항 생성
	@PostMapping
	public CommonResponse<?> createNotice(
		@RequestHeader("X-MEMBER-ROLE") String role,
		@RequestBody NoticeDto noticeDto) {
		try {
			RoleType roleType = RoleType.fromString(role);
			if (roleType == RoleType.STUDENT) {
				throw new EumException(ErrorCode.AUTHORITY_PERMISSION_ERROR);
			}
			noticeService.createNotice(noticeDto);
			return CommonResponse.success("공지사항 생성 성공");
		} catch (IllegalArgumentException e) {
			throw new EumException(ErrorCode.AUTHORITY_PERMISSION_ERROR);
		} catch (Exception e) {
			throw new EumException(ErrorCode.INTERNAL_SERVER_ERROR);
		}

	}

	//공지사항 수정
	@PutMapping("/{noticeId}")
	public CommonResponse<?> updateNotice(
		@RequestHeader("X-MEMBER-ROLE") String role,
		@PathVariable Long noticeId, @RequestBody NoticeDto noticeDto) {
		try {
			RoleType roleType = RoleType.fromString(role);
			if (roleType == RoleType.STUDENT) {
				throw new EumException(ErrorCode.AUTHORITY_PERMISSION_ERROR);
			}
			noticeService.updateNotice(noticeId, noticeDto);
			return CommonResponse.success("공지사항 수정 성공");
		} catch (IllegalArgumentException e) {
			throw new EumException(ErrorCode.AUTHORITY_PERMISSION_ERROR);
		} catch (Exception e) {
			throw new EumException(ErrorCode.INTERNAL_SERVER_ERROR);
		}

	}

	@DeleteMapping("/{noticeId}")
	public CommonResponse<?> deleteNotice(
		@RequestHeader("X-MEMBER-ROLE") String role,
		@PathVariable Long noticeId) {
		try {
			RoleType roleType = RoleType.fromString(role);
			if (roleType == RoleType.STUDENT) {
				throw new EumException(ErrorCode.AUTHORITY_PERMISSION_ERROR);
			}
			noticeService.deleteNotice(noticeId);
			return CommonResponse.success("공지사항 삭제 성공");
		} catch (IllegalArgumentException e) {
			throw new EumException(ErrorCode.AUTHORITY_PERMISSION_ERROR);
		} catch (Exception e) {
			throw new EumException(ErrorCode.INTERNAL_SERVER_ERROR);
		}

	}
}
