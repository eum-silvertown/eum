package com.eum.drawingservice.domain.lesson.api;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import com.eum.drawingservice.domain.lesson.dto.DrawingResponseDTO;
import com.eum.drawingservice.global.CommonResponse;
import com.eum.drawingservice.domain.lesson.service.DrawingService;

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
		DrawingResponseDTO response = drawingService.getMemberDrawingData(teacherId, lessonId, questionId);
		return CommonResponse.success(response, "선생님 데이터 조회 성공");
	}

	@GetMapping("/student/{studentId}/lesson/{lessonId}")
	public CommonResponse<?> getStudentDrawingData(
		@PathVariable Long studentId,
		@PathVariable Long lessonId,
		@RequestParam("questionId") Long questionId
	) {
		DrawingResponseDTO response = drawingService.getMemberDrawingData(studentId, lessonId, questionId);
		return CommonResponse.success(response, "학생 데이터 조회 성공");
	}
}
