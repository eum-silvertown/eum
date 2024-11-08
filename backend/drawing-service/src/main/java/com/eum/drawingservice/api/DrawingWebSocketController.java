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
    public void handleDrawingEvent(@Payload DrawingRequestDTO requestDTO, SimpMessageHeaderAccessor headerAccessor) {
        try {
            String memberId = Objects.requireNonNull(headerAccessor.getUser()).getName();
            Role memberRole = Role.valueOf(Objects.requireNonNull(headerAccessor.getFirstNativeHeader("role")));

            requestDTO.setMemberId(Long.valueOf(memberId));
            drawingService.saveDrawing(requestDTO);
            if (memberRole == Role.TEACHER) {
                String sendUrl = "/topic/lesson/" + requestDTO.getLessonId() + "/question/" + requestDTO.getQuestionId();
                messagingTemplate.convertAndSend(sendUrl, requestDTO);
            } else {
                String sendUrl = "/topic/teacher/lesson/" + requestDTO.getLessonId();
                messagingTemplate.convertAndSend(sendUrl, requestDTO);
            }
        } catch (NullPointerException e) {
            return;
        }
    }

    @MessageMapping("/test")
    public void test() {
        messagingTemplate.convertAndSend("/topic/test", "SUCCESS HANGNIM!!");
        System.out.println(">>> RECEIVED");
    }
}
