package com.eum.drawingservice.domain.blackboard.api;

import com.eum.drawingservice.domain.blackboard.dto.SnapShotRequestDTO;
import com.eum.drawingservice.domain.blackboard.entity.DrawingPoint;
import com.eum.drawingservice.domain.blackboard.service.BlackBoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class BlackBoardController {

    private final SimpMessagingTemplate messagingTemplate;
    private final BlackBoardService blackBoardService;

    @MessageMapping("/drawing/classroom/{classroomId}")
    public void drawingBlackBoard(@Payload List<DrawingPoint> requestDTO, @DestinationVariable String classroomId) {
        blackBoardService.drawingBlackBoard(requestDTO, classroomId);
        messagingTemplate.convertAndSend("/topic/classroom/" + classroomId, requestDTO);
    }

    // SnapShot 저장 API
    @MessageMapping("/snapshot")
    public void saveSnapShot(@Payload SnapShotRequestDTO requestDTO) {
        blackBoardService.saveSnapShot(requestDTO);
    }
}
