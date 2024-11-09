package com.eum.drawingservice.api;

import com.eum.drawingservice.dto.DrawingRequestDTO;
import com.eum.drawingservice.entity.Role;
import com.eum.drawingservice.service.DrawingService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Objects;

@Controller
@RequiredArgsConstructor
public class DrawingWebSocketController {

    private final DrawingService drawingService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/draw")
    public void handleDrawingEvent(@Payload DrawingRequestDTO requestDTO) {
        drawingService.saveDrawing(requestDTO);
        String sendUrl;
        if (requestDTO.getRole() == Role.TEACHER) {
            sendUrl = "/topic/lesson/" + requestDTO.getLessonId() + "/question/" + requestDTO.getQuestionId();
        } else {
            sendUrl = "/topic/teacher/lesson/" + requestDTO.getLessonId();
        }
        messagingTemplate.convertAndSend(sendUrl, requestDTO);
    }
}
