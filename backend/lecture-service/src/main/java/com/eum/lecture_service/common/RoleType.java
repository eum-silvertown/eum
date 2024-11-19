package com.eum.lecture_service.common;

public enum RoleType {

	TEACHER,
	STUDENT;

	public static RoleType fromString(String role) {
		for (RoleType type : RoleType.values()) {
			if (type.name().equals(role)) {
				return type;
			}
		}
		throw new IllegalArgumentException("Invalid role: " + role);
	}
}
