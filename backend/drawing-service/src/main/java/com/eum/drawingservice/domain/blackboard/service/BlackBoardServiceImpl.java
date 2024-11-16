package com.eum.drawingservice.domain.blackboard.service;

import com.eum.drawingservice.domain.blackboard.dto.SnapShotRequestDTO;
import com.eum.drawingservice.domain.blackboard.dto.SnapShotResponseDTO;
import com.eum.drawingservice.domain.blackboard.entity.DrawingOperation;
import com.eum.drawingservice.domain.blackboard.entity.DrawingPoint;
import com.eum.drawingservice.domain.blackboard.entity.SnapShot;
import com.eum.drawingservice.domain.blackboard.repository.DrawingOperationRepository;
import com.eum.drawingservice.domain.blackboard.repository.SnapShotRepository;
import com.eum.drawingservice.global.subscribe.ChannelName;
import com.eum.drawingservice.global.subscribe.SubscriptionManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.MessageHeaders;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class BlackBoardServiceImpl implements BlackBoardService {

    private final SimpMessagingTemplate messagingTemplate;
    private final SubscriptionManager subscriptionManger;

    private final DrawingOperationRepository drawingOperationRepository;
    private final SnapShotRepository snapShotRepository;

    @Override
    public void drawingBlackBoard(List<DrawingPoint> requestDTO, String classroomId) {
        // 2. 해당 버전에 맞는 drawingOperation 가져오기. 없으면 생성
        DrawingOperation drawingOperation = drawingOperationRepository
                .findByClassroomId(classroomId).orElse(null);
        if (drawingOperation == null) {
            drawingOperation = DrawingOperation.builder()
                    .classroomId(classroomId)
                    .snapshotVersion(0)
                    .points(new ArrayList<>())
                    .build();
        }

        // 3. drawingOperation에 requestDTO 추가 및 저장
        drawingOperation.addPoint(requestDTO);
        drawingOperationRepository.save(drawingOperation);
    }

    @Override
    public SnapShotResponseDTO getSnapShot(String classroomId) {
        // 1. drawingOperation 가져오기
        DrawingOperation drawingOperation = drawingOperationRepository.findByClassroomId(classroomId).orElse(null);
        int latestVersion = drawingOperation == null ? 0 : drawingOperation.getSnapshotVersion();

        // 2. 해당 버전에 맞는 snapshot 가져오기
        SnapShot snapShot = snapShotRepository
                .findByClassroomIdAndVersion(classroomId, latestVersion).orElse(null);

        return SnapShotResponseDTO.builder()
                .snapShot(snapShot)
                .drawingOperation(drawingOperation)
                .build();
    }

   @Override
   @Scheduled(fixedRate = 1000 * 60 * 10)
   public void requestSnapShot() {
       // 현재 연결되어 있는 사용자 중 한 명에게 스냅샷을 위한 imageData를 요청
       Map<String, Set<String>> channelSubscriptions = subscriptionManger.getChannelSubscriptions(ChannelName.BLACKBOARD);
       if (channelSubscriptions.isEmpty()) {
           return;
       }

       for (String subscriptionKey : channelSubscriptions.keySet()) {
           if (channelSubscriptions.get(subscriptionKey).isEmpty()) {
               continue;
           }
           String sessionId = channelSubscriptions.get(subscriptionKey).iterator().next();
           messagingTemplate.convertAndSendToUser(sessionId, "/queue/snapshot", "REQUEST", createHeaders(sessionId));
       }
   }

    @Override
    public void saveSnapShot(SnapShotRequestDTO requestDTO) {
        // 1. 해당 클래스룸의 최신 버전 번호 받아오기
        DrawingOperation drawingOperation = drawingOperationRepository
                .findByClassroomId(String.valueOf(requestDTO.getClassroomId())).orElse(null);
        int latestVersion = drawingOperation == null ? 0 : drawingOperation.getSnapshotVersion();

        // 2. 해당 imageData를 SnapShot으로 저장
        SnapShot snapShot = snapShotRepository
                .findByClassroomIdAndVersion(String.valueOf(requestDTO.getClassroomId()), latestVersion)
                .orElse(null);

        if (snapShot == null) {
            snapShot = SnapShot.builder()
                    .classroomId(String.valueOf(requestDTO.getClassroomId()))
                    .version(latestVersion)
                    .build();
        }
        snapShot.setImageData(requestDTO.getImageData());
        snapShot.versionUp();
        snapShotRepository.save(snapShot);

        // 3. drawingOperation 버전 업데이트
        if (drawingOperation != null) {
            drawingOperation.snapshotVersionUp();
            drawingOperation.removeAllPoints();
            drawingOperationRepository.save(drawingOperation);
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
