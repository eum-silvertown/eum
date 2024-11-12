package com.eum.notification_service.entity;

import com.eum.notification_service.config.jpa.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "notifications")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notifications extends BaseEntity {

	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "notification_id")
	private Long notificationId;

	@Column(name = "member_id")
	private Long memberId;

	@Column(name = "title")
	private String title;

	@Column(name = "message")
	private String message; //알림 내용

	@Setter
	@Column(name = "is_read")
	private Boolean isRead;

}
