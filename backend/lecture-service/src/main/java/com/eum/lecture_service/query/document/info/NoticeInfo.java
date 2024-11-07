package com.eum.lecture_service.query.document.info;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoticeInfo {
    private Long noticeId;
    private String title;
    private String content;
    private LocalDateTime createdAt;
}