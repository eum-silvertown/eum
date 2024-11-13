package com.eum.drawingservice.api;

import com.eum.drawingservice.dto.DrawingRequestDTO;
import com.eum.drawingservice.entity.Role;
import com.eum.drawingservice.global.subscribe.ChannelName;
import com.eum.drawingservice.service.DrawingService;
import com.eum.drawingservice.global.subscribe.SubscriptionManager;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class DrawingWebSocketController {

    private final DrawingService drawingService;
    private final SubscriptionManager subscriptionManger;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/draw")
    public void handleDrawingEvent(@Payload DrawingRequestDTO requestDTO, SimpMessageHeaderAccessor headerAccessor) {
        drawingService.saveDrawing(requestDTO);

        if (requestDTO.getRole() == Role.TEACHER) {
            String sendUrl = "/topic/lesson/" + requestDTO.getLessonId() + "/question/" + requestDTO.getQuestionId();
            messagingTemplate.convertAndSend(sendUrl, requestDTO);
        } else {
            String sessionId = headerAccessor.getSessionId();
            String subscriptionKey = requestDTO.getLessonId() + ":" + requestDTO.getMemberId();
            String teacherDestination = "/topic/teacher/lesson/" + requestDTO.getLessonId() + "/member/" + requestDTO.getMemberId();
            if (subscriptionManger.isSubscribed(
                    sessionId,
                    ChannelName.TEACHER_LESSON_MEMBER,
                    subscriptionKey)) {
                messagingTemplate.convertAndSend(teacherDestination, requestDTO);
            }
        }
    }
}
