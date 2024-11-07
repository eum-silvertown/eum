package com.eum.lecture_service.query.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.eum.lecture_service.query.document.eventModel.StudentModel;

public interface StudentReadRepository extends MongoRepository<StudentModel, Long> {
}
