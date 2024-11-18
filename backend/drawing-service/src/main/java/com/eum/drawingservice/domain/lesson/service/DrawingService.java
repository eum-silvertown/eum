package com.eum.drawingservice.domain.lesson.service;

import com.eum.drawingservice.domain.lesson.dto.DrawingRequestDTO;
import com.eum.drawingservice.domain.lesson.dto.DrawingResponseDTO;

public interface DrawingService {

    void saveDrawing(DrawingRequestDTO requestDTO);

    DrawingResponseDTO getMemberDrawingData(Long memberId, Long lessonId, Long questionId);
}
