package com.eum.drawingservice.service;

import com.eum.drawingservice.dto.DrawingRequestDTO;
import com.eum.drawingservice.dto.DrawingResponseDTO;

public interface DrawingService {

    void saveDrawing(DrawingRequestDTO requestDTO);

    DrawingResponseDTO getTeacherDrawingData(Long teacherId, Long lessonId, Long questionId);
}
