package com.eum.drawingservice.domain.blackboard.repository;

import com.eum.drawingservice.domain.blackboard.entity.DrawingOperation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface DrawingOperationRepository extends MongoRepository<DrawingOperation, String> {

    Optional<DrawingOperation> findByClassroomId(String classroomId);
}
