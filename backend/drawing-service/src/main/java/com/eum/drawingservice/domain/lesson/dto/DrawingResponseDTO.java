package com.eum.drawingservice.domain.lesson.dto;

import com.eum.drawingservice.domain.lesson.entity.Drawing;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DrawingResponseDTO {
	private String drawingData;
	private Long lessonId;
	private Long memberId;
	private Long questionId;

	public static DrawingResponseDTO of(Drawing drawing) {
		return DrawingResponseDTO.builder()
				.drawingData(drawing.getDrawingData())
				.lessonId(Long.valueOf(drawing.getLessonId()))
				.memberId(Long.valueOf(drawing.getMemberId()))
				.questionId(Long.valueOf(drawing.getQuestionId()))
				.build();
	}
}
