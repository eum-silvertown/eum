package com.eum.drawingservice.api;

import jakarta.ws.rs.QueryParam;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eum.drawingservice.dto.DrawingResponseDTO;
import com.eum.drawingservice.global.CommonResponse;
import com.eum.drawingservice.service.DrawingService;

@RestController
@RequestMapping("/drawing")
@RequiredArgsConstructor
public class DrawingRestController {

	private final DrawingService drawingService;

	@GetMapping("/teacher/{teacherId}/lesson/{lessonId}")
	public CommonResponse<?> getTeacherDrawingData(
		@PathVariable Long teacherId,
		@PathVariable Long lessonId,
		@QueryParam("questionId") Long questionId
	) {
		DrawingResponseDTO response = drawingService.getTeacherDrawingData(teacherId, lessonId, questionId);
		return CommonResponse.success(response, "선생님 데이터 조회 성공");
	}

}
