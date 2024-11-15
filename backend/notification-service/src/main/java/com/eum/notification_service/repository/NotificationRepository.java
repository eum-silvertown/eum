package com.eum.notification_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eum.notification_service.entity.Notifications;

public interface NotificationRepository extends JpaRepository<Notifications, Long> {

	List<Notifications> findByMemberIdAndIsReadFalse(Long memberId);

	List<Notifications> findByMemberIdAndIsReadTrue(Long memberId);
}
