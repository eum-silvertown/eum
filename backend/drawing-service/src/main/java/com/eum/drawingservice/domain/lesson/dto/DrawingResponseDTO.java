package com.eum.drawingservice.domain.lesson.dto;

import com.eum.drawingservice.domain.lesson.entity.Drawing;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DrawingResponseDTO {
	private String drawingData;
	private double width;
	private double height;
	private double ratio;
	private Long lessonId;
	private Long memberId;
	private Long questionId;

	public static DrawingResponseDTO of(Drawing drawing) {
		return DrawingResponseDTO.builder()
				.drawingData(drawing.getDrawingData())
				.width(Double.parseDouble(drawing.getWidth()))
				.height(Double.parseDouble(drawing.getHeight()))
				.ratio(Double.parseDouble(drawing.getRatio()))
				.lessonId(Long.valueOf(drawing.getLessonId()))
				.memberId(Long.valueOf(drawing.getMemberId()))
				.questionId(Long.valueOf(drawing.getQuestionId()))
				.build();
	}
}
