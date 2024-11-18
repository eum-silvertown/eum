package com.eum.eum_library.global.common;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CommonResponse<T> {

	private String code;
	private T data;
	private String message;

	public static <T> CommonResponse<T> success(T data, String message) {
		return CommonResponse.<T>builder()
			.code("S000")
			.data(data)
			.message(message)
			.build();
	}

	public static <T> CommonResponse<T> success(String message) {
		return CommonResponse.<T>builder()
			.code("S000")
			.data(null)
			.message(message)
			.build();
	}
}