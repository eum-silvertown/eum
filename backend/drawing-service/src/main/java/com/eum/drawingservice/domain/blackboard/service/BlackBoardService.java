package com.eum.drawingservice.domain.blackboard.service;

import com.eum.drawingservice.domain.blackboard.dto.SnapShotRequestDTO;
import com.eum.drawingservice.domain.blackboard.dto.SnapShotResponseDTO;
import com.eum.drawingservice.domain.blackboard.entity.DrawingPoint;

import java.util.List;

public interface BlackBoardService {

    void drawingBlackBoard(List<DrawingPoint> requestDTO, String classroomId);

    SnapShotResponseDTO getSnapShot(String classroomId);

//    void requestSnapShot();

    void saveSnapShot(SnapShotRequestDTO requestDTO);
}
