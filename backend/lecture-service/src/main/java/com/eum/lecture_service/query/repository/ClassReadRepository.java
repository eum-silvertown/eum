package com.eum.lecture_service.query.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.eum.lecture_service.query.document.eventModel.ClassModel;

public interface ClassReadRepository extends MongoRepository<ClassModel, Long> {


}
