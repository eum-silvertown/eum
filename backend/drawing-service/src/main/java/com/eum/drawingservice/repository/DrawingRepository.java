package com.eum.drawingservice.repository;

import com.eum.drawingservice.entity.Drawing;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface DrawingRepository extends MongoRepository<Drawing, String> {

    Optional<Drawing> findByMemberIdAndLessonIdAndQuestionId(String memberId, String lessonId, String questionId);
}
