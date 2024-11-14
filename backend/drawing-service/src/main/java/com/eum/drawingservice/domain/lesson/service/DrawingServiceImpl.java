package com.eum.drawingservice.domain.lesson.service;

import com.eum.drawingservice.domain.lesson.dto.DrawingRequestDTO;
import com.eum.drawingservice.domain.lesson.dto.DrawingResponseDTO;
import com.eum.drawingservice.domain.lesson.entity.Drawing;
import com.eum.drawingservice.domain.lesson.repository.DrawingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DrawingServiceImpl implements DrawingService {

    private final DrawingRepository drawingRepository;

    @Override
    public void saveDrawing(DrawingRequestDTO requestDTO) {
        Drawing existingDrawing = drawingRepository.findByMemberIdAndLessonIdAndQuestionId(
                String.valueOf(requestDTO.getMemberId()),
                String.valueOf(requestDTO.getLessonId()),
                String.valueOf(requestDTO.getQuestionId())
        ).orElse(null);

        if(existingDrawing == null) {
            existingDrawing = Drawing.builder()
                    .memberId(String.valueOf(requestDTO.getMemberId()))
                    .lessonId(String.valueOf(requestDTO.getLessonId()))
                    .questionId(String.valueOf(requestDTO.getQuestionId()))
                    .drawingData(requestDTO.getDrawingData())
                    .build();
        } else {
            existingDrawing.setDrawingData(requestDTO.getDrawingData());
        }

        drawingRepository.save(existingDrawing);
    }

    @Override
    public DrawingResponseDTO getTeacherDrawingData(Long teacherId, Long lessonId, Long questionId) {
        Drawing drawing = drawingRepository.findByMemberIdAndLessonIdAndQuestionId(
            String.valueOf(teacherId),
            String.valueOf(lessonId),
            String.valueOf(questionId)).orElse(null);

        return drawing == null ? null : DrawingResponseDTO.of(drawing);
    }
}
