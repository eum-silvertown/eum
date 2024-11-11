package com.eum.drawingservice.api;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

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
		@RequestParam("questionId") Long questionId
	) {
		DrawingResponseDTO response = drawingService.getTeacherDrawingData(teacherId, lessonId, questionId);
		return CommonResponse.success(response, "선생님 데이터 조회 성공");
	}

}
