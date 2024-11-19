package com.eum.drawingservice.domain.blackboard.repository;

import com.eum.drawingservice.domain.blackboard.entity.SnapShot;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface SnapShotRepository extends MongoRepository<SnapShot, String> {

    Optional<SnapShot> findByClassroomIdAndVersion(String classroomId, int snapshotVersion);
}
