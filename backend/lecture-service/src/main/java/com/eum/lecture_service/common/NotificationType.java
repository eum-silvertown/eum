package com.eum.lecture_service.common;

public enum NotificationType {

	LECTURE_CREATION("수업 생성"),
	LECTURE_START("수업 시작"),
	EXAM_CREATION("시험 생성"),
	HOMEWORK_CREATION("숙제 생성");

	private final String description;

	NotificationType(String description) {
		this.description = description;
	}

	public String getDescription() {
		return description;
	}
}
