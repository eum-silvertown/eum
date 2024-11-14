package com.eum.drawingservice.api;

import com.eum.drawingservice.dto.DrawingRequestDTO;
import com.eum.drawingservice.entity.Role;
import com.eum.drawingservice.global.subscribe.ChannelName;
import com.eum.drawingservice.service.DrawingService;
import com.eum.drawingservice.global.subscribe.SubscriptionManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Set;

@Slf4j
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
            String subscriptionKey = requestDTO.getLessonId() + ":" + requestDTO.getMemberId();
            String teacherDestination = "/topic/teacher/lesson/" + requestDTO.getLessonId()
                    + "/member/" + requestDTO.getMemberId();

            subscriptionManger.getSubscribedSessions(ChannelName.TEACHER_LESSON_MEMBER, subscriptionKey)
                    .forEach(sessionId ->
                            messagingTemplate.convertAndSendToUser(
                                    sessionId, teacherDestination, requestDTO, createHeaders(sessionId))
                    );
        }
    }

    private MessageHeaders createHeaders(String sessionId) {
        SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.create(SimpMessageType.MESSAGE);
        if (sessionId != null) {
            headerAccessor.setSessionId(sessionId);
        }
        headerAccessor.setLeaveMutable(true);
        return headerAccessor.getMessageHeaders();
    }
}
