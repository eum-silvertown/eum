package com.eum.drawingservice.service;

import com.eum.drawingservice.dto.DrawingRequestDTO;

public interface DrawingService {

    void saveDrawing(DrawingRequestDTO requestDTO);
}
